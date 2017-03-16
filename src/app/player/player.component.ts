import { Component } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent {
  playerUrl: string;

  constructor(public locationService: LocationService) {
    this.playerUrl = null;

    locationService.playerUrl.subscribe(id => {
      if (id) {
        this.playerUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/' + id + '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
      } else {
        this.playerUrl = null;
      }
    });
  }
}
