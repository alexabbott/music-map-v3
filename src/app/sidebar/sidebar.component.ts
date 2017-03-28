import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../global.service';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  map;
  filteredPlaylists: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  userPlaylists: FirebaseListObservable<any[]>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  orderValue: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;
  headline: string;
  showForm: boolean;
  showMenu: boolean;

  constructor(public af: AngularFire, public globalService: GlobalService) {
    this.filterKey = null;
    this.filterValue = null;
    this.orderValue = '-published';
    this.filteredPlaylists = af.database.list('/playlists');
    this.users = af.database.object('/users');
    this.showForm = false;
    this.showMenu = false;

    let me = this;

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        globalService.updateUser(auth.auth);
        globalService.updateUserId(this.userId);
        af.database.object('/users/' + this.userId).update({ name: auth.auth.displayName, uid: auth.uid, photoURL: auth.auth.photoURL, email: auth.auth.email });
        this.user = af.database.object('/users/' + this.userId);
        this.userPlaylists = af.database.list('/user-playlists/' + this.userId);
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });

    globalService.map.subscribe(themap => {
      this.map = themap;
    });
    globalService.filterKey.subscribe(key => {
      this.filterKey = key;
    });
    globalService.filterValue.subscribe(value => {
      this.filterValue = value;
    });
    globalService.headline.subscribe(headline => {
      this.headline = headline;
    });
    globalService.showReset.subscribe(bool => {
      this.showReset = bool;
    });
    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });
  }

  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }

  resetPlaylists() {
    this.showReset = false;
    this.filterKey = null;
    this.filterValue = null;
    this.map.setZoom(3);
    this.headline = null;
  }

  changeOrder(neworder) {
    this.orderValue = neworder;
  }

  filterByCurrentUser() {
    this.filterKey = 'user';
    this.filterValue = this.userId;
    this.showReset = true;
    this.headline = 'My Playlists';
    this.showMenu = false;
  }
}
