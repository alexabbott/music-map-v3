import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  hidden: boolean;

  constructor(public globalService: GlobalService) {
    this.hidden = false;
  }

  ngOnInit() {
    const me = this;

    setTimeout(() => {
      me.hidden = true;
    }, 3000);
  }

}
