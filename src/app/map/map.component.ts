import { Component, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { LocationService } from '../location.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  mapOptions;
  map;
  newlocation: string;
  locations: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  showReset: boolean;

  constructor(public af: AngularFire, public locationService: LocationService) {
    const me = this;
    this.locations = af.database.list('/location-stations');
    this.mapOptions = {
      zoom: 3,
      styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
    };

  }
  onMapReady(map) {
    this.locationService.updateMap(map);
    console.log('map', map);
    console.log('markers', map.markers);
    const input = <HTMLInputElement>document.getElementById('autocomplete');
    const autocompleteOptions = {
      types: ['(cities)']
    };
    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      const coordinates = <HTMLInputElement>document.getElementById('coordinates');
      coordinates.value = place.geometry.location.toString().replace('(', '').replace(')', '');

      if (!place.geometry) {
        console.log("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(5);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    });
  }
  onIdle(event) {
    console.log('map idle', event.target);
  }
  convertCoordinates(coordinate) {
    coordinate = coordinate.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    return coordinate;
  }
  onMarkerInit(marker) {
    const me = this;
    marker.addListener('click', function() {
      me.showReset = true;
      console.log('marker coordinates', me.convertCoordinates(marker.position.lat()) + ', ' + me.convertCoordinates(marker.position.lng()));
      marker.map.setCenter({lat: marker.position.lat(), lng: marker.position.lng()});
      marker.map.setZoom(6);
      me.locationService.updateLocation('coordinates', me.convertCoordinates(marker.position.lat()));
      me.locationService.updateReset();
    });
  }
}
