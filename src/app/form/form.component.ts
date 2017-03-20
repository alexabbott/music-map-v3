import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../global.service';

@Component({
  selector: 'add-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  filteredPlaylists: FirebaseListObservable<any[]>;
  user;
  showForm: boolean;
  searchData;
  searchResults: Array<any>;
  newName: string;
  newLocation: HTMLInputElement;
  newCoordinates: HTMLInputElement;
  searchKeyword: string;
  newUrl: string;

  private clientId: string = '8e1349e63dfd43dc67a63e0de3befc68';
  private http: Http;

  constructor(public af: AngularFire, public globalService: GlobalService, http: Http) {
    this.newLocation = <HTMLInputElement>document.getElementById('autocomplete');
    this.newCoordinates = <HTMLInputElement>document.getElementById('coordinates');
    this.http = http;
		console.log('http', this.http);

    this.filteredPlaylists = af.database.list('/stations');

    globalService.user.subscribe(user => {
      this.user = user;
      console.log('thisuser', this.user);
    });

    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });
  }

  getSoundcloudPlaylists(keyword: string) {
    this.http.get('http://api.soundcloud.com/playlists?linked_partitioning=1&client_id=' + this.clientId + '&q=' + keyword)
      .map(res => {
        res.text();
        console.log('res', res.json().collection);
        this.searchResults = res.json().collection;
      })
      .subscribe(
        data => this.searchData = data,
        err => this.logError(err)
      );
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }

  addPlaylist(newName: string, newLocation: string, newCoordinates: string, newUrl: string) {
    let d = new Date();
    let newDate = d.getTime();
    if (newName && newLocation && newCoordinates && newUrl && newDate) {
      let newKey = newUrl.toString() + newDate.toString();
      this.af.database.object('/stations/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, user: this.user.uid, userName: this.user.displayName, published: newDate, likesTotal: 0 });
      this.af.database.object('/location-stations/' + newLocation + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, user: this.user.uid, userName: this.user.displayName, published: newDate });
      this.af.database.object('/users-stations/' + this.user.uid + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, user: this.user.uid, userName: this.user.displayName, published: newDate });

      // this.newlocation.value = '';
      // this.newcoordinates.value = '';
      this.newName = '';
      this.newUrl = '';
      this.searchKeyword = '';

      this.globalService.toggleForm();
    }
  }

  updatePlayer(url) {
    this.globalService.updatePlayerUrl(url);
  }
}
