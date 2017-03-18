import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class LocationService {
  public map = new BehaviorSubject(null);
  public filterKey = new BehaviorSubject(null);
  public filterValue = new BehaviorSubject(null);
  public showReset = new BehaviorSubject(false);
  public playerUrl = new BehaviorSubject(null);
  public userId = new BehaviorSubject(null);
  public showForm = new BehaviorSubject(false);
  public soundcloudId = new BehaviorSubject('8e1349e63dfd43dc67a63e0de3befc68');
  
  public updateLocation(key, value) {
    this.filterKey.next(key);
    this.filterValue.next(value);
  }
  public updateReset() {
    this.showReset.next(true);
  }
  public updateMap(themap) {
    this.map.next(themap);
  }
  public updatePlayerUrl(url) {
    this.playerUrl.next(url);
  }
  public updateUserId(id) {
    this.userId.next(id);
  }
  public toggleForm() {
    this.showForm.next(!this.showForm.getValue());
  }
}
