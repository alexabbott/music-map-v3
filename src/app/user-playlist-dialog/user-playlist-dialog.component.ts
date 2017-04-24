import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'user-playlist-dialog',
  templateUrl: './user-playlist-dialog.component.html',
  styleUrls: ['./user-playlist-dialog.component.scss']
})
export class UserPlaylistDialogComponent {

  constructor(public dialogRef: MdDialogRef<any>) { }

}