import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from '../global.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent {
  soundManager;
  private http: Http;
  playlistTracks;
  playlistData;
  currentTrack;
  currentSound;
  newSounds;
  currentlyPlaying: boolean;

  constructor(public globalService: GlobalService, http: Http) {
    this.http = http;
    this.currentlyPlaying = false;

    this.soundManager = window['soundManager'];

    globalService.playerUrl.subscribe(id => {
      if (id) {
        this.playMusic(id);
      }
    });

    this.soundManager.setup({
      url: '../../assets/swf'
    });

  }
  playMusic(id: string) {

    this.http.get('https://api.soundcloud.com/playlists/' + id + '?client_id=' + this.globalService.soundcloudId.getValue())
      .map(res => {
        res.text();
        console.log('res', res.json().tracks);
        this.playlistTracks = res.json().tracks;

        let playlistLength = this.playlistTracks.length;
        this.newSounds = [];
        for (let i = 0; i < playlistLength; i++) {
          this.newSounds.push(this.soundManager.createSound({
            id: this.playlistTracks[i].id.toString(),
            url: 'https://api.soundcloud.com/tracks/' + this.playlistTracks[i].id + '/stream?client_id=' + this.globalService.soundcloudId.getValue(),
            onfinish: () => {
              if (this.newSounds[i+1]) {
                this.currentTrack = this.playlistTracks[i+1];
                this.currentSound = this.newSounds[i+1];
                this.newSounds[i+1].play();
              }
					  },
            onPlay: () => {
              this.currentlyPlaying = true;
            },
            onPause: () => {
              this.currentlyPlaying = false;
            }
          }));
          if (i == 0) {
            this.currentTrack = this.playlistTracks[i];
            if (this.currentSound) {
              this.currentSound.stop();
            }
            this.currentSound = this.newSounds[i];
            this.newSounds[i].play();
            this.currentlyPlaying = true;
          }
        }
      })
      .subscribe(
        data => this.playlistData = data
      );
  }

  playSound() {
    this.currentSound.play();
    this.currentlyPlaying = true;
  }

  pauseSound() {
    this.currentSound.pause();
    this.currentlyPlaying = false;
  }

  playPrevious() {
    let currentIndex = this.newSounds.indexOf(this.currentSound);
    this.currentlyPlaying = true;
    this.currentSound.stop();
    if (this.newSounds[currentIndex - 1]) {
      this.currentSound = this.newSounds[currentIndex - 1];
      this.currentTrack = this.playlistTracks[currentIndex - 1];
      this.newSounds[currentIndex - 1].play();
    } else {
      this.currentSound = this.newSounds[this.newSounds.length - 1];
      this.currentTrack = this.playlistTracks[this.playlistTracks.length - 1];
      this.newSounds[this.newSounds.length - 1].play();
    }
  }

  playNext() {
    let currentIndex = this.newSounds.indexOf(this.currentSound);
    this.currentlyPlaying = true;
    this.currentSound.stop();
    if (this.newSounds[currentIndex + 1]) {
      this.currentSound = this.newSounds[currentIndex + 1];
      this.currentTrack = this.playlistTracks[currentIndex + 1];
      this.newSounds[currentIndex + 1].play();
    } else {
      this.currentSound = this.newSounds[0];
      this.currentTrack = this.playlistTracks[0];
      this.newSounds[0].play();
    }
  }
}
