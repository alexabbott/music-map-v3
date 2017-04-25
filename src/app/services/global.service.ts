import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public map = new BehaviorSubject(null);
  public coordinates = new BehaviorSubject(null);
  public filterKey = new BehaviorSubject(null);
  public filterValue = new BehaviorSubject(null);
  public headline = new BehaviorSubject(null);
  public showReset = new BehaviorSubject(false);
  public playerUrl = new BehaviorSubject(null);
  public playerIndex = new BehaviorSubject(null);
  public user = new BehaviorSubject(null);
  public users = new BehaviorSubject(null);
  public userId = new BehaviorSubject(null);
  public showForm = new BehaviorSubject(false);
  public currentTrack = new BehaviorSubject(null);
  public currentTrackName = new BehaviorSubject(null);
  public currentSound = new BehaviorSubject(null);
  public currentPlaylist = new BehaviorSubject(null);
  public currentPlaylistObject = new BehaviorSubject(null);
  public playlistKey = new BehaviorSubject(null);
  public playlistName = new BehaviorSubject(null);
  public playlistLocation = new BehaviorSubject(null);
  public playlistTag = new BehaviorSubject(null);
  public playlistTracks = new BehaviorSubject(null);
  public playlistCoordinates = new BehaviorSubject(null);
  public locationPlaylists = new BehaviorSubject(null);
  public filterBy = new BehaviorSubject(null);
  public currentLocation = new BehaviorSubject(null);
  public currentUserName = new BehaviorSubject(null);
  public showLocationPlaylists = new BehaviorSubject(false);
  public showTagPlaylists = new BehaviorSubject(false);
  public tagPlaylists = new BehaviorSubject(null);
  public currentTag = new BehaviorSubject(null);
  public usersId = new BehaviorSubject(null);
  public usersName = new BehaviorSubject(null);
  public showUserProfile = new BehaviorSubject(false);
  public soundcloudId = new BehaviorSubject('8e1349e63dfd43dc67a63e0de3befc68');

  public updateLocation(key, value) {
    this.filterKey.next(key);
    this.filterValue.next(value);
  }
  public updateMapCenter(coordinates) {
    this.coordinates.next(coordinates);
  }
  public updateReset() {
    this.showReset.next(true);
  }
  public updateHeadline(headline) {
    this.headline.next(headline);
  }
  public updateMap(themap) {
    this.map.next(themap);
  }
  public updatePlayerUrl(url) {
    this.playerUrl.next(url);
  }
  public updateUsers(users) {
    this.users.next(users);
  }
  public updateUser(user) {
    this.user.next(user);
  }
  public updateUserId(id) {
    this.userId.next(id);
  }
  public toggleForm() {
    this.showForm.next(!this.showForm.getValue());
  }
  public setFormValues(key, name, location, tag, tracks, coordinates) {
    this.playlistKey.next(key);
    this.playlistName.next(name);
    this.playlistLocation.next(location);
    this.playlistTag.next(tag);
    this.playlistTracks.next(tracks);
    this.playlistCoordinates.next(coordinates);
  }
}
