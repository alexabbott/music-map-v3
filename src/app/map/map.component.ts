import { Component, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../global.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  mapOptions;
  markerOptions;
  map;
  newlocation: string;
  locations: FirebaseListObservable<any[]>;
  showReset: boolean;

  constructor(public af: AngularFire, public globalService: GlobalService) {
    const me = this;
    this.locations = af.database.list('/location-stations');
    this.mapOptions = {
      zoom: 3,
      styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#944242"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"},{"saturation":"-1"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#292929"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#494949"},{"saturation":"-85"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#888888"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dddddd"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]}]
    };

    this.markerOptions = {
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
  }

  onMapReady(map) {
    this.globalService.updateMap(map);
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
      me.globalService.updateLocation('coordinates', me.convertCoordinates(marker.position.lat()));
      me.globalService.updateReset();
    });
  }
}
