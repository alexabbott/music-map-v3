import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylistDialogComponent } from './user-playlist-dialog.component';

describe('UserPlaylistDialogComponent', () => {
  let component: UserPlaylistDialogComponent;
  let fixture: ComponentFixture<UserPlaylistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPlaylistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
