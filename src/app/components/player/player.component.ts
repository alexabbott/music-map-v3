import { Component } from '@angular/core';
import { LocationService } from '../../app.component';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent {
  playerUrl: string;

  constructor(public locationService: LocationService) {
    this.playerUrl = null;

    locationService.playerUrl.subscribe(url => {
      this.playerUrl = url;
    });
  }
}
