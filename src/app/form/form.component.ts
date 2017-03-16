import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { LocationService } from '../location.service';

@Component({
  selector: 'add-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  filteredStations: FirebaseListObservable<any[]>;
  userId: string;
  showForm: boolean;

  constructor(public af: AngularFire, public locationService: LocationService) {

    this.filteredStations = af.database.list('/stations');

    locationService.userId.subscribe(id => {
      this.userId = id;
    });

    locationService.showForm.subscribe(bool => {
      this.showForm = bool;
    });
  }

  addStation(newName: string, newLocation: string, newCoordinates: string, newUrl: string) {
    let d = new Date();
    if (newName && newLocation && newCoordinates && newUrl) {
      this.filteredStations.push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, user: this.userId, published: d.getTime(), likesTotal: 0 });
      this.af.database.list('/location-stations/' + newLocation).push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, published: d.getTime() });
      this.af.database.list('/users-stations/' + this.userId).push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, published: d.getTime() });
    }
  }
}
