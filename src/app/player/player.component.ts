import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { LocationService } from '../location.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent {
  soundManager;
  private http: Http;
  playlistTracks;
  playlistData;
  currentTrack;

  constructor(public locationService: LocationService, http: Http) {
    this.http = http;

    this.soundManager = window['soundManager'];

    locationService.playerUrl.subscribe(id => {
      if (id) {
        this.playMusic(id);
      }
    });

    this.soundManager.setup({
      url: '../../../node_modules/soundmanager2/swf'
    });

  }
  playMusic(id: string) {

    this.http.get('https://api.soundcloud.com/playlists/' + id + '?client_id=' + this.locationService.soundcloudId.getValue())
      .map(res => {
        res.text();
        console.log('res', res.json().tracks);
        this.playlistTracks = res.json().tracks;

        let playlistLength = this.playlistTracks.length;
        let newSounds = [];
        for (let i = 0; i < playlistLength; i++) {
          newSounds.push(this.soundManager.createSound({
            id: this.playlistTracks[i].id.toString(),
            url: 'https://api.soundcloud.com/tracks/' + this.playlistTracks[i].id + '/stream?client_id=' + this.locationService.soundcloudId.getValue(),
            onfinish: () => {
              if (newSounds[i+1]) {
                this.currentTrack = this.playlistTracks[i+1];
                newSounds[i+1].play();
              }
					  }
          }));
          if (i == 0) {
            this.currentTrack = this.playlistTracks[i];
            newSounds[i].play();
          }
        }
      })
      .subscribe(
        data => this.playlistData = data
      );
  }

  playSound() {
    this.soundManager.play();
  }

  pauseSound() {
    this.soundManager.pause();
  }
}
