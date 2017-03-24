import { Component, Input } from '@angular/core';
import { GlobalService } from '../global.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss']
})
export class PlaylistCardComponent {
  @Input() playlist;
  filteredPlaylists: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  playerUrl: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;
  headline: string;

  constructor(public af: AngularFire, public globalService: GlobalService) {
    this.users = af.database.object('/users');
    this.filteredPlaylists = af.database.list('/stations');
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.user = af.database.object('/users/' + auth.uid);
        this.userId = auth.uid;
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });

    globalService.playerUrl.subscribe(url => {
      this.playerUrl = url;
    });
  }

  updatePlaylist(key: string, newName: string, newLocation: string, newCoordinates: string, newUrl: string) {
    this.filteredPlaylists.update(key, { name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl });
  }

  deletePlaylist(key: string, location: string) {
    this.filteredPlaylists.remove(key);
    this.af.database.list('/users-stations/' + this.userId).remove(key);
    this.af.database.list('/location-stations/' + location).remove(key);
    let loc = this.af.database.list('/location-stations/' + location);
    loc.subscribe(subscribe => {
      let length = subscribe.length;
      if (length === 0) {
        loc.remove(location);
      }
    });
  }

  likePlaylist(key: string, user: string) {
    this.af.database.list('/users/' + this.userId + '/likes/' + key).push(key);
    this.af.database.list('/stations/' + key + '/likes/' + this.userId).push(this.userId);
    this.af.database.list('/users-stations/' + user + '/' + key + '/likes/' + this.userId).push(this.userId);
    let likes = this.af.database.list('/stations/' + key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/stations/' + key).update({ likesTotal: length });
      this.af.database.object('/users-stations/' + user + '/' + key).update({ likesTotal: length });
    });
  }

  unlikePlaylist(key: string, user: string) {
    this.af.database.list('/users/' + this.userId + '/likes').remove(key);
    this.af.database.list('/stations/' + key + '/likes').remove(this.userId);
    this.af.database.list('/users-stations/' + user + '/' + key + '/likes/' + this.userId).remove(this.userId);
    let likes = this.af.database.list('/stations/' + key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/stations/' + key).update({ likesTotal: length });
      this.af.database.object('/users-stations/' + user + '/' + key).update({ likesTotal: length });
    });
  }

  filterByTag(tag) {
    this.globalService.updateLocation('tag', tag);
    this.globalService.updateReset();
    this.globalService.updateHeadline(tag);
  }

  filterByUser(uid) {
    this.globalService.updateLocation('user', uid);
    this.globalService.updateReset();
    this.globalService.updateHeadline(null);
  }

  filterByLocation(loc, coo) {
    this.globalService.updateLocation('location', loc);
    this.globalService.updateMapCenter(coo);
    this.globalService.updateReset();
    this.globalService.updateHeadline(loc);
  }

  updatePlayer(url) {
    this.globalService.updatePlayerUrl(url);
  }
}
