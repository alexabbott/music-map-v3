import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { Ng2MapModule} from 'ng2-map';
import { DndModule } from 'ng2-dnd';

//services
import { GlobalService } from './services/global.service';

//pipes
import { SearchPipe } from './pipes/search.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterUserLikesPipe } from './pipes/filter-user-likes.pipe';
import { FirstPipe } from './pipes/first.pipe';
import { GetPipe } from './pipes/get.pipe';
import { OrderBy } from './pipes/order-by.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { LastNamePipePipe } from './pipes/last-name-pipe.pipe';

//components
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PlayerComponent } from './player/player.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { PlaylistCardComponent } from './playlist-card/playlist-card.component';
import { SplashComponent } from './splash/splash.component';

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyDo2DoOzdHzYFwcHju_kgIV1M6wh9Babek",
    authDomain: "beatmap-7177b.firebaseapp.com",
    databaseURL: "https://beatmap-7177b.firebaseio.com",
    projectId: "beatmap-7177b",
    storageBucket: "beatmap-7177b.appspot.com",
    messagingSenderId: "398802251123"
  };

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

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
    PlaylistCardComponent,
    SplashComponent,
    SlugifyPipe,
    LastNamePipePipe
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    DndModule.forRoot(),
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD9e_lkQIiKtphl0vGK3MjbC589jQcRtvk&libraries=places'})
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
