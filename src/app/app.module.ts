import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { GlobalService } from './global.service';
import { SafePipe } from './safe.pipe';
import { FilterPipe } from './filter.pipe';
import { FilterUserLikesPipe } from './filter-user-likes.pipe';
import { FirstPipe } from './first.pipe';
import { GetPipe } from './get.pipe';
import { OrderBy } from './order-by.pipe';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PlayerComponent } from './player/player.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import { Ng2MapModule} from 'ng2-map';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { SearchPipe } from './search.pipe';
import { PlaylistCardComponent } from './playlist-card/playlist-card.component';
import 'hammerjs';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDIrmC834Tivjh8EM0G2h8oUbC2gIye86o",
  authDomain: "music-map-23635.firebaseapp.com",
  databaseURL: "https://music-map-23635.firebaseio.com",
  storageBucket: "music-map-23635.appspot.com",
  messagingSenderId: "1038601253190"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

// enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PlayerComponent,
    GetPipe,
    FirstPipe,
    FilterPipe,
    FilterUserLikesPipe,
    OrderBy,
    SafePipe,
    MapComponent,
    FormComponent,
    SearchPipe,
    PlaylistCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    MaterialModule,
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD9e_lkQIiKtphl0vGK3MjbC589jQcRtvk&libraries=places'})
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
