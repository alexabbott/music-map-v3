import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../services/global.service';
import { MdDialogRef, MdDialog } from '@angular/material';
import { UserPlaylistDialogComponent } from '../user-playlist-dialog/user-playlist-dialog.component'

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  map: any;
  filteredPlaylists: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  userPlaylists: FirebaseListObservable<any[]>;
  usersPlaylists: FirebaseListObservable<any[]>;
  userLikedPlaylists: FirebaseListObservable<any[]>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  orderValue: string;
  showReset: boolean;
  showForm: boolean;
  showMenu: boolean;
  searchTerm: string;
  filterBy: string;
  showCurrentUserProfile: boolean;
  currentUserName: string;
  currentUserId: string;
  totalCurrentUserLikes: number;
  currentUserPlaylistCount: number;
  currentUserLikedCount: number;
  selectedUserLikedCount: number;
  selectedUserPlaylistCount: number;
  showLocationPlaylists: boolean;
  showTagPlaylists: boolean;
  showUserProfile: boolean;

  constructor(public af: AngularFire, public globalService: GlobalService, public dialog: MdDialog) {
    this.orderValue = '-published';
    this.filteredPlaylists = af.database.list('/playlists');
    this.users = af.database.object('/users');
    this.showForm = false;
    this.showMenu = false;
    this.showCurrentUserProfile = false;
    this.totalCurrentUserLikes = 0;
    this.currentUserPlaylistCount = 0;
    this.currentUserLikedCount = 0;

    let me = this;

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        globalService.updateUser(auth.auth);
        globalService.updateUserId(this.userId);
        af.database.object('/users/' + this.userId).update({ name: auth.auth.displayName, uid: auth.uid, photoURL: auth.auth.photoURL, email: auth.auth.email });
        this.user = af.database.object('/users/' + this.userId);
        this.userPlaylists = af.database.list('/playlists', {
          query: {
            orderByChild: 'user',
            equalTo: this.userId
          }
        });
        this.userPlaylists.subscribe(playlist => {
          this.currentUserPlaylistCount = playlist.length;
          for (let i = 0; i < this.currentUserPlaylistCount; i++) {
            this.totalCurrentUserLikes += playlist[i].likesTotal;
          }
        });
        this.userLikedPlaylists = af.database.list('/user-likes/' + this.userId);
        this.userLikedPlaylists.subscribe(playlist => {
          this.currentUserLikedCount = playlist.length;
        });
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });

    globalService.map.subscribe(themap => {
      this.map = themap;
    });
    globalService.showReset.subscribe(bool => {
      this.showReset = bool;
    });
    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });

    globalService.filterBy.subscribe(filter => {
      this.filterBy = filter;
    });

    // filter by user
    globalService.currentUserName.subscribe(name => {
      this.currentUserName = name;
    });
    globalService.usersId.subscribe(uid => {
      this.currentUserId = uid;
      if (uid) {
        this.showCurrentUserProfile = false;
        this.filteredPlaylists = af.database.list('/playlists', {
          query: {
            orderByChild: 'user',
            equalTo: uid
          }
        });
        this.selectedUserLikedCount = 0;
        this.changeOrder('-published');
        this.filteredPlaylists.subscribe(playlist => {
          this.selectedUserPlaylistCount = playlist.length;
          for (let i = 0; i < this.selectedUserPlaylistCount; i++) {
            this.selectedUserLikedCount += playlist[i].likesTotal;
          }
        });
      }
    });

    // filter by location
    globalService.locationPlaylists.subscribe(location => {
      globalService.currentLocation = location;
      if (location) {
        this.showCurrentUserProfile = false;
        this.changeOrder('-likesTotal');
        this.filteredPlaylists = af.database.list('/playlists', {
          query: {
            orderByChild: 'location',
            equalTo: location
          }
        });
      }
    });

    // filter by tag
    globalService.tagPlaylists.subscribe(tag => {
      globalService.currentTag = tag;
      if (tag) {
        this.showCurrentUserProfile = false;
        this.changeOrder('-likesTotal');
        this.filteredPlaylists = af.database.list('/playlists', {
          query: {
            orderByChild: 'tag',
            equalTo: tag
          }
        });
      }
    });
  }

  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }

  togglePlaylistForm() {
    console.log(this.currentUserPlaylistCount);
    console.log(this.totalCurrentUserLikes);
    if ((this.currentUserPlaylistCount <= 9) || (this.currentUserPlaylistCount <= 15 && this.totalCurrentUserLikes < 50 && this.totalCurrentUserLikes >= 25) || (this.currentUserPlaylistCount <= 20 && this.totalCurrentUserLikes < 100 && this.totalCurrentUserLikes >= 50)) {
      this.globalService.toggleForm();
      this.globalService.playlistKey.next(null)
    } else {
      this.dialog.open(UserPlaylistDialogComponent);
    }
  }

  resetPlaylists() {
    this.filteredPlaylists = this.af.database.list('/playlists');
    this.showReset = false;
    this.showCurrentUserProfile = false;
    this.globalService.filterBy.next('');
    this.map.setZoom(3);
    this.searchTerm = '';
    this.changeOrder('-published');
  }

  changeOrder(neworder) {
    this.orderValue = neworder;
  }

  filterByCurrentUser() {
    this.showReset = true;
    this.showMenu = false;
    this.showCurrentUserProfile = true;
  }
}
