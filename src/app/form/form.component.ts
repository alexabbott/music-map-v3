import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../services/global.service';
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
  user: any;
  showForm: boolean;
  searchData: any;
  searchResults: Array<any>;
  playlistKey: any;
  playlistTracks: Array<any>;
  newName: string;
  newLocation: string;
  newCoordinates: string;
  searchKeyword: string;
  newTag: string;
  tags: Array<any>;
  map: any;

  private clientId: string = '8e1349e63dfd43dc67a63e0de3befc68';
  private http: Http;

  private makeSearch(value: string, code: number) {
    this.searchUpdated.next(value);
    if (code === 13) {
      document.getElementById('soundcloud-search').blur();
    }
  }
  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(public af: AngularFire, public globalService: GlobalService, http: Http) {
    this.http = http;

    this.playlistTracks = [];

    this.searchUpdated.next('');

    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
         .debounceTime(400)
          .distinctUntilChanged().subscribe(q => {
            this.getSoundcloudPlaylists(this.searchUpdated.getValue());
          });

    this.filteredPlaylists = af.database.list('/playlists');

    this.tags = [
      { value: 'Blazing' },
      { value: 'Chilling' },
      { value: 'Commuting' },
      { value: 'Dancing' },
      { value: 'Driving' },
      { value: 'Festival' },
      { value: 'Focusing' },
      { value: 'Getting ready' },
      { value: 'Getting weird' },
      { value: 'Hiking' },
      { value: 'Hooking up' },
      { value: 'Partying' },
      { value: 'Pregaming' },
      { value: 'Road tripping' },
      { value: 'Rocking out' },
      { value: 'Running' },
      { value: 'Tripping balls' },
      { value: 'Waking up' },
      { value: 'Working out' },
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

    globalService.playlistName.subscribe(name => {
      this.newName = name;
    });

    globalService.playlistLocation.subscribe(location => {
      this.newLocation = location;
    });

    globalService.playlistTag.subscribe(tag => {
      this.newTag = tag;
    });

    globalService.playlistTracks.subscribe(tracks => {
      if (tracks && tracks.length > 0) {
        this.playlistTracks = tracks;
      }
    });

    globalService.playlistCoordinates.subscribe(coordinates => {
      this.newCoordinates = coordinates;
    });

    globalService.playlistKey.subscribe(key => {
      this.playlistKey = key;
    });
  }

  getSoundcloudPlaylists(keyword: string) {
    if (keyword !== '') {
      this.http.get('https://api.soundcloud.com/tracks?linked_partitioning=1&limit=30&client_id=' + this.clientId + '&q=' + keyword)
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

  updatePlaylist(key, newName, newLocation, newCoordinates, newTag) {
    let d = new Date();
    let newDate = d.getTime();
    if (newName && newLocation && newCoordinates && newTag && this.playlistTracks.length > 0 && newDate) {
      var coordinateArray = newCoordinates.split(',');
      let trackIdArray = [];
      let playlistLength = this.playlistTracks.length;
      for (let i = 0; i < playlistLength; i++) {
        trackIdArray.push({
          id: this.playlistTracks[i].id,
          title: this.playlistTracks[i].title,
          user: {
            username: this.playlistTracks[i].user.username
          },
          artwork_url: this.playlistTracks[i].artwork_url
        });
      }
      console.log('trackarray', trackIdArray);
      this.af.database.object('/playlists/' + key).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate, likesTotal: 0 });
      this.af.database.object('/location-playlists/' + newLocation + '/' + key).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });
      this.af.database.object('/user-playlists/' + this.user.uid + '/' + key).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });

      this.newLocation = '';
      this.newCoordinates = '';
      this.newName = '';
      this.newTag = '';
      this.searchKeyword = '';
      this.playlistTracks = [];
      this.searchResults = [];

      this.globalService.toggleForm();
    }
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
        trackIdArray.push({
          id: this.playlistTracks[i].id,
          title: this.playlistTracks[i].title,
          user: {
            username: this.playlistTracks[i].user.username
          },
          artwork_url: this.playlistTracks[i].artwork_url
        });
      }
      console.log('trackarray', trackIdArray);
      let newKey = trackIdArray[0].id.toString() + newDate.toString();
      this.af.database.object('/playlists/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate, likesTotal: 0 });
      this.af.database.object('/location-playlists/' + newLocation + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });
      this.af.database.object('/user-playlists/' + this.user.uid + '/' + newKey).update({ name: newName, location: newLocation, coordinates: newCoordinates, tracks: trackIdArray, tag: newTag, user: this.user.uid, userName: this.user.displayName, published: newDate });

      this.newLocation = '';
      this.newCoordinates = '';
      this.newName = '';
      this.newTag = '';
      this.searchKeyword = '';
      this.playlistTracks = [];
      this.searchResults = [];

      this.globalService.toggleForm();
    }
  }

  addToPlaylist(result) {
    console.log('tracks', this.playlistTracks);
    console.log('res', result);
    this.playlistTracks.push(result);
  }

  removeFromPlaylist(track) {
    this.playlistTracks.splice(this.playlistTracks.indexOf(track), 1);
  }

  updatePlayer(url) {
    this.globalService.updatePlayerUrl(url);
  }
}
