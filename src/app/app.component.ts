import { Component, Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  mapOptions;
  stations: FirebaseListObservable<any[]>;
  newstation: HTMLTemplateElement;
  newlocation: string;

  filteredStations: FirebaseListObservable<any[]>;
  locations: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  orderValue: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;

  constructor(public af: AngularFire) {
    const me = this;
    this.stations = af.database.list('/stations');
    this.mapOptions = {
      zoom: 4,
      styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
    };

    this.filterKey = null;
    this.filterValue = null;
    this.orderValue = '-published';
    this.filteredStations = af.database.list('/stations');
    this.locations = af.database.list('/location-stations');
    this.users = af.database.object('/users');

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        af.database.object('/users/' + this.userId).update({ name: auth.auth.displayName, uid: auth.uid, photoURL: auth.auth.photoURL, email: auth.auth.email });
        this.user = af.database.object('/users/' + this.userId);
        this.user.subscribe(user => {
          console.log('thieuser', user);
        });
      }
    });
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
    console.log('map idle', event.target);
  }
  convertCoordinates(coordinate) {
    coordinate = coordinate.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    return coordinate;
  }
  onMarkerInit(marker) {
    const me = this;
    let geocoder = new google.maps.Geocoder();
    marker.addListener('click', function() {
      console.log('marker coordinates', me.convertCoordinates(marker.position.lat()) + ', ' + me.convertCoordinates(marker.position.lng()));
      marker.map.setCenter({lat: marker.position.lat(), lng: marker.position.lng()});
      marker.map.setZoom(14);
      me.filterByLocation(me.convertCoordinates(marker.position.lat()));
    });
  }


  login() {
    this.af.auth.login();
  }
  logout() {
     this.af.auth.logout();
  }
  addStation(newName: string, newLocation: string, newCoordinates: string, newUrl: string) {
    let d = new Date();
    if (newName && newLocation && newCoordinates && newUrl) {
      this.filteredStations.push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, user: this.userId, published: d.getTime(), likesTotal: 0 });
      this.af.database.list('/location-stations/' + newLocation).push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, published: d.getTime() });
      this.af.database.list('/users-stations/' + this.userId).push({ name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl, published: d.getTime() });
    }
  }
  updateStation(key: string, newName: string, newLocation: string, newCoordinates: string, newUrl: string) {
    this.filteredStations.update(key, { name: newName, location: newLocation, coordinates: newCoordinates, url: newUrl });
  }
  deleteStation(key: string, location: string) {
    this.filteredStations.remove(key);
    this.af.database.list('/user-stations/' + this.userId).remove(key);
    this.af.database.list('/location-stations/' + location).remove(key);
  }
  deleteEverything() {
    this.filteredStations.remove();
  }
  likeStation(key: string) {
    this.af.database.list('/users/' + this.userId + '/likes/' + key).push(key);
    this.af.database.list('/stations/' + key + '/likes/' + this.userId).push(this.userId);
    let likes = this.af.database.list('/stations/' + key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/stations/' + key).update({ likesTotal: length });
    });
  }
  unlikeStation(key: string) {
    this.af.database.list('/users/' + this.userId + '/likes').remove(key);
    this.af.database.list('/stations/' + key + '/likes').remove(this.userId);
    let likes = this.af.database.list('/stations/' + key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/stations/' + key).update({ likesTotal: length });
    });
  }
  changeOrder(neworder) {
    this.orderValue = neworder;
  }
  filterByLocation(value) {
    this.filterKey = 'coordinates';
    // this.filterValue = 'New York';
    this.filterValue = value;
  }
}
