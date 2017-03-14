import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent, LocationService } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PlayerComponent } from './components/player/player.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import { Ng2MapModule} from 'ng2-map';

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

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({ name: 'get' })
export class GetPipe implements PipeTransform {
  transform(val, args) {
    if (val === null) return val;
    return val[args];
  }
}

@Pipe({ name: 'first' })
export class FirstPipe implements PipeTransform {
  transform(val, args) {
    if (val === null) return val;
    return val[0];
  }
}

@Pipe({name: 'orderBy', pure: false})
export class OrderBy implements PipeTransform {

    static _orderByComparator(a:any, b:any):number{

      if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
        //Isn't a number so lowercase the string to properly compare
        if(a.toLowerCase() < b.toLowerCase()) return -1;
        if(a.toLowerCase() > b.toLowerCase()) return 1;
      }
      else{
        //Parse strings as numbers to compare properly
        if(parseFloat(a) < parseFloat(b)) return -1;
        if(parseFloat(a) > parseFloat(b)) return 1;
      }

      return 0; //equal each other
    }

    transform(input:any, [config = '+']): any{

        if(!Array.isArray(input)) return input;

        if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
            var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
            var desc = propertyToCheck.substr(0, 1) == '-';

            //Basic array
            if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
                return !desc ? input.sort() : input.sort().reverse();
            }
            else {
                var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;

                return input.sort(function(a:any,b:any){
                    return !desc 
                        ? OrderBy._orderByComparator(a[property], b[property]) 
                        : -OrderBy._orderByComparator(a[property], b[property]);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return input.sort(function(a:any,b:any){
                for(var i:number = 0; i < config.length; i++){
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];

                    var comparison = !desc
                        ? OrderBy._orderByComparator(a[property], b[property])
                        : -OrderBy._orderByComparator(a[property], b[property]);

                    //Don't return 0 yet in case of needing to sort by next property
                    if(comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}

@Pipe({ name: 'filter' })
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {
        if (!items) return [];
        if (field && value) {
          return items.filter(it => it[field].indexOf(value) > -1);
        } else {
          return items;
        }
    }
}

@Pipe({ name: 'filterUserLikes' })
@Injectable()
export class FilterUserLikesPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {
        if (!items) return [];
        if (field && value) {
          return items.filter(it => {
            if (it[field]) {
              console.log('match');
              value in it[field];
            }
          });
        } else {
          return items;
        }
    }
}

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
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    MaterialModule,
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD9e_lkQIiKtphl0vGK3MjbC589jQcRtvk&libraries=places'})
  ],
  providers: [LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
