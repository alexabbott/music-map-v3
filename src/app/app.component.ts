import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';
  stations: FirebaseListObservable<any[]>;

  constructor(af: AngularFire) {
    this.stations = af.database.list('/stations');
  }

  onMapReady(map) {
    console.log('map', map);
    console.log('markers', map.markers);
  }
  onIdle(event) {
    console.log('map', event.target);
  }
  onMarkerInit(marker) {
    console.log('marker', marker);
  }
}
