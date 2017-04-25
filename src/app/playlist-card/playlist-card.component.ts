import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component'

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
  userPlaylists: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  playerUrl: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;
  headline: string;
  openPlaylist: string;
  dialogRef: MdDialogRef<any>;
  selectedOption: string;
  currentTrack: string;

  constructor(public af: AngularFire, public globalService: GlobalService, public snackBar: MdSnackBar, public dialog: MdDialog) {
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

    globalService.currentTrackName.subscribe(name => {
      this.currentTrack = name;
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
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      if (this.selectedOption === 'delete') {
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
        this.snackBar.open('Playlist deleted', 'OK!', {
          duration: 2000,
        });
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

    this.snackBar.open('Liked ' + playlist.name, 'OK!', {
      duration: 2000,
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

    this.snackBar.open('Unliked ' + playlist.name, 'OK!', {
      duration: 2000,
    });
  }

  filterByTag(tag) {
    this.globalService.updateReset();
    this.globalService.filterBy.next('tag');
    this.globalService.tagPlaylists.next(tag);
  }

  filterByUser(uid, userName) {
    this.globalService.updateReset();
    this.globalService.filterBy.next('user');
    this.globalService.currentUserName.next(userName);
    this.globalService.usersId.next(uid);
  }

  filterByLocation(loc, coo) {
    this.globalService.filterBy.next('location');
    this.globalService.locationPlaylists.next(loc);
    this.globalService.updateMapCenter(coo);
    this.globalService.updateReset();
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
