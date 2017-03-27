import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../global.service';
import { BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: 'add-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  searchUpdated: BehaviorSubject<string> = new BehaviorSubject(null);
  filteredPlaylists: FirebaseListObservable<any[]>;
  user;
  showForm: boolean;
  searchData;
  searchResults: Array<any>;
  playlistTracks: Array<any>;
  newName: string;
  newLocation: HTMLInputElement;
  newCoordinates: HTMLInputElement;
  searchKeyword: string;
  newTag: string;
  tags: Array<any>;
  map: any;

  private clientId: string = '8e1349e63dfd43dc67a63e0de3befc68';
  private http: Http;

  private makeSearch(value: string) {
    this.searchUpdated.next(value);
  }
  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(public af: AngularFire, public globalService: GlobalService, http: Http) {
    this.newLocation = <HTMLInputElement>document.getElementById('autocomplete');
    this.newCoordinates = <HTMLInputElement>document.getElementById('coordinates');
    this.http = http;

    this.playlistTracks = [];

    this.searchUpdated.next('');

    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
         .debounceTime(400)
          .distinctUntilChanged().subscribe(q => {
            this.getSoundcloudPlaylists(this.searchUpdated.getValue());
          });

    this.filteredPlaylists = af.database.list('/stations');

    this.tags = [
      { value: 'Chill' },
      { value: 'Dance Party' },
      { value: 'Festival Music' },
      { value: 'Get Weird' },
      { value: 'Rage' },
      { value: 'Road Trip' },
      { value: 'Rock Out' },
      { value: 'Twerk It' },
      { value: 'Work Time' }
    ];

    globalService.user.subscribe(user => {
      this.user = user;
    });

    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });

    globalService.map.subscribe(themap => {
      this.map = themap;
    });
  }

  getSoundcloudPlaylists(keyword: string) {
    if (keyword !== '') {
      this.http.get('http://api.soundcloud.com/tracks?linked_partitioning=1&client_id=' + this.clientId + '&q=' + keyword)
        .map(res => {
          res.text();
          this.searchResults = res.json().collection;
        })
        .subscribe(
          data => this.searchData = data,
          err => this.logError(err)
        );
    }
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }

  addPlaylist(newName: string, newLocation: string, newCoordinates: string, newTag: string) {
    let d = new Date();
    let newDate = d.getTime();
    if (!newTag) {
      newTag = '';
    }
    if (newName && newLocation && newCoordinates && this.playlistTracks.length > 0 && newDate) {
      var coordinateArray = newCoordinates.split(',');
      let trackIdArray = [];
      let playlistLength = this.playlistTracks.length;
      for (let i = 0; i < playlistLength; i++) {
        trackIdArray.push(this.playlistTracks[i].id);
      }
      let newKey = trackIdArray[0].toString() + newDate.toString();
      this.af.database.object('/stations/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate, likesTotal: 0 });
      this.af.database.object('/location-stations/' + newLocation + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });
      this.af.database.object('/users-stations/' + this.user.uid + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });

      // this.newlocation.value = '';
      // this.newcoordinates.value = '';
      this.newName = '';
      this.newTag = '';
      this.searchKeyword = '';
      this.playlistTracks = [];

      this.globalService.toggleForm();
    }
  }

  addToPlaylist(result) {
    this.playlistTracks.push(result);
  }

  removeFromPlaylist(track) {
    this.playlistTracks.splice(this.playlistTracks.indexOf(track), 1);
  }

  updatePlayer(url) {
    this.globalService.updatePlayerUrl(url);
  }
}
