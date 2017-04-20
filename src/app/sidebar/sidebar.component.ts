import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../services/global.service';

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
  showLocationPlaylists: boolean;
  showTagPlaylists: boolean;
  showUserProfile: boolean;

  constructor(public af: AngularFire, public globalService: GlobalService) {
    this.orderValue = '-published';
    this.filteredPlaylists = af.database.list('/playlists');
    this.users = af.database.object('/users');
    this.showForm = false;
    this.showMenu = false;
    this.showCurrentUserProfile = false;

    let me = this;

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        globalService.updateUser(auth.auth);
        globalService.updateUserId(this.userId);
        af.database.object('/users/' + this.userId).update({ name: auth.auth.displayName, uid: auth.uid, photoURL: auth.auth.photoURL, email: auth.auth.email });
        this.user = af.database.object('/users/' + this.userId);
        this.userPlaylists = af.database.list('/user-playlists/' + this.userId);
        this.userLikedPlaylists = af.database.list('/user-likes/' + this.userId);
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
        this.filteredPlaylists = af.database.list('/playlists', {
          query: {
            orderByChild: 'user',
            equalTo: uid
          }
        });
      }
    });

    // filter by location
    globalService.locationPlaylists.subscribe(location => {
      globalService.currentLocation = location;
      if (location) {
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

  resetPlaylists() {
    this.filteredPlaylists = this.af.database.list('/playlists');
    this.showReset = false;
    this.showCurrentUserProfile = false;
    this.globalService.filterBy.next('');
    this.map.setZoom(3);
    this.searchTerm = '';
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
