import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  mapOptions;
  stations: FirebaseListObservable<any[]>;
  newstation: HTMLTemplateElement;

  constructor(public af: AngularFire) {
    this.stations = af.database.list('/stations');
    this.mapOptions = {
      zoom: 13,
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#000000"},{"visibility":"on"},{"gamma":0.01}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"gamma":0.01}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"invert_lightness":true},{"color":"#808080"},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"invert_lightness":true},{"saturation":-100},{"gamma":9.99}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"gamma":0.01},{"invert_lightness":true}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"gamma":0.01},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"invert_lightness":true},{"gamma":0.01},{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"gamma":0.01},{"weight":2.6}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#808080"},{"weight":0.4},{"lightness":45}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#808080"},{"lightness":26}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"invert_lightness":true},{"visibility":"on"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#000000"},{"gamma":0.01}]},{"featureType":"transit.station.airport","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"gamma":0.01}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"invert_lightness":true},{"visibility":"on"},{"gamma":9.99}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"simplified"},{"saturation":-100},{"gamma":0.01}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#000000"},{"visibility":"simplified"}]}]
    };
  }
  onMapReady(map) {
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
    console.log('map', event.target);
  }
  onMarkerInit(marker) {
    console.log('marker', marker);
  }
}
