import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class LocationService {
  public map = new BehaviorSubject(null);
  public filterKey = new BehaviorSubject(null);
  public filterValue = new BehaviorSubject(null);
  public showReset = new BehaviorSubject(false);
  public playerUrl = new BehaviorSubject(null);
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
}
