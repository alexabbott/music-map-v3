import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss']
})
export class PlaylistCardComponent implements OnInit {
  @Input() playlist;
  filteredPlaylists: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  userLikes: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  playerUrl: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;
  headline: string;
  openPlaylist: string;

  constructor(public af: AngularFire, public globalService: GlobalService) {
    this.users = af.database.object('/users');
    this.filteredPlaylists = af.database.list('/playlists');
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.user = af.database.object('/users/' + auth.uid);
        this.userId = auth.uid;
        this.userLikes = af.database.object('/user-likes/' + this.userId);
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });


    globalService.playerUrl.subscribe(url => {
      this.playerUrl = url;
    });
  }

  ngOnInit() {
    if (typeof this.playlist === 'string') {
      this.af.database.object('/playlists/' + this.playlist).subscribe(p => {
        this.playlist = p;
      });
    }
  }

  updatePlaylist(key: string, name:string, location:string, tag:string, tracks:any, coordinates:string) {
    this.globalService.toggleForm();
    this.globalService.setFormValues(key, name, location, tag, tracks, coordinates);
  }

  deletePlaylist(key: string, location: string) {
    this.filteredPlaylists.remove(key);
    this.af.database.list('/user-playlists/' + this.userId).remove(key);
    this.af.database.list('/location-playlists/' + location).remove(key);
    let loc = this.af.database.list('/location-playlists/' + location);
    loc.subscribe(subscribe => {
      let length = subscribe.length;
      if (length === 0) {
        loc.remove(location);
      }
    });
  }

  likePlaylist(playlist) {
    this.af.database.object('/user-likes/' + this.userId + '/' + playlist.$key).set(Date.now());
    this.af.database.list('/playlists/' + playlist.$key + '/likes/' + this.userId).push(this.userId);
    let likes = this.af.database.list('/playlists/' + playlist.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/playlists/' + playlist.$key).update({ likesTotal: length });
    });
  }

  unlikePlaylist(playlist) {
    this.af.database.list('/user-likes/' + this.userId).remove(playlist.$key);
    this.af.database.list('/playlists/' + playlist.$key + '/likes').remove(this.userId);
    let likes = this.af.database.list('/playlists/' + playlist.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/playlists/' + playlist.$key).update({ likesTotal: length });
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

  updatePlayer(playlist, e) {
    e.stopPropagation();
    this.globalService.currentPlaylistObject.next(playlist);
    this.globalService.updatePlayerUrl(playlist.tracks);
  }

  updatePlayerTrack(playlist, i) {
    this.globalService.currentPlaylistObject.next(playlist);
    this.globalService.playerUrl.next(playlist.tracks);
    this.globalService.playerIndex.next(i);
  }

  toggleTracks(name) {
    if (this.openPlaylist === name) {
      this.openPlaylist = '';
    } else {
      this.openPlaylist = name;
    }
  }
}
