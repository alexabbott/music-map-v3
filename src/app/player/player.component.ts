import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from '../services/global.service';
import '../../assets/soundmanager2.js';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent {
  soundManager;
  private http: Http;
  playlistTracks: any;
  playlistTrack: any;
  playlistData: any;
  isPlaylist: boolean;
  currentPlaylist: any;
  currentIndex: any;
  currentTrack: any;
  currentSound: any;
  newSounds: any;
  newSound: any;
  currentlyPlaying: boolean;

  constructor(public globalService: GlobalService, http: Http) {
    this.http = http;
    this.currentlyPlaying = false;

    this.soundManager = window['soundManager'];

    globalService.playerUrl.subscribe(id => {
      this.playTrack(id, 0);
    });

    globalService.playerIndex.subscribe(i => {
      this.playTrack(globalService.playerUrl.getValue(), i);
    });

    this.soundManager.setup({
      url: '../../assets/swf'
    });
  }

  playTrack(id, i) {
    if (typeof id === "object" && id && id.length > 0) {
      this.currentPlaylist = id;
      this.currentIndex = i;
      this.playlistTrack = {
        id: id[i].id,
        title: id[i].title,
        artwork_url: id[i].artwork_url,
        user: id[i].user
      };
      this.globalService.currentPlaylist.next(id);
      this.globalService.currentTrackName.next(id[i].title);
      console.log('service', this.globalService.currentTrackName.getValue());
      this.newSound = this.soundManager.createSound({
        id: ('a' + id[i].id.toString()),
        url: 'https://api.soundcloud.com/tracks/' + id[i].id + '/stream?client_id=' + this.globalService.soundcloudId.getValue(),
        onfinish: () => {
          this.playTrack(id, i + 1);
        },
        onPlay: () => {
          this.currentlyPlaying = true;
        },
        onPause: () => {
          this.currentlyPlaying = false;
        }
      });
      this.currentTrack = this.playlistTrack;
      if (this.currentSound) {
        this.currentSound.stop();
      }
      this.currentSound = this.newSound;
      this.globalService.currentSound.next(this.currentSound);
      this.newSound.play();
      this.currentlyPlaying = true;
    } else if (typeof id !== "object" && id) {
      this.currentPlaylist = null;
      this.http.get('https://api.soundcloud.com/tracks/' + id + '?client_id=' + this.globalService.soundcloudId.getValue())
        .map(res => {
          res.text();
            this.playlistTrack = res.json();
            this.globalService.currentTrack.next(this.playlistTrack.id);
            this.globalService.currentTrackName.next(this.playlistTrack.name);
            console.log('service', this.globalService.currentTrackName.getValue());
            this.newSound = this.soundManager.createSound({
              id: ('a' + id.toString()),
              url: 'https://api.soundcloud.com/tracks/' + id + '/stream?client_id=' + this.globalService.soundcloudId.getValue(),
              onfinish: () => {
                this.currentlyPlaying = false;
              },
              onPlay: () => {
                this.currentlyPlaying = true;
              },
              onPause: () => {
                this.currentlyPlaying = false;
              }
            });
            this.currentTrack = this.playlistTrack;
            if (this.currentSound) {
              this.currentSound.stop();
            }
            this.currentSound = this.newSound;
            this.globalService.currentSound.next(this.currentSound);
            this.newSound.play();
            this.currentlyPlaying = true;
        })
        .subscribe(
          data => this.playlistData = data
        );
    }
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
    if (this.currentPlaylist && this.currentPlaylist.length > 1) {
      this.currentlyPlaying = true;
      this.currentSound.stop();
      if (this.currentPlaylist[this.currentIndex - 1]) {
        this.playTrack(this.currentPlaylist, (this.currentIndex - 1));
      } else {
        this.playTrack(this.currentPlaylist, (this.currentPlaylist.length - 1));
      }
    }
  }

  playNext() {
    if (this.currentPlaylist && this.currentPlaylist.length > 1) {
      this.currentlyPlaying = true;
      this.currentSound.stop();
      if (this.currentPlaylist[this.currentIndex + 1]) {
        this.playTrack(this.currentPlaylist, (this.currentIndex + 1));
      } else {
        this.playTrack(this.currentPlaylist, 0);
      }
    }
  }
}
