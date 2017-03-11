import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import { Ng2MapModule} from 'ng2-map';
import { Pipe, PipeTransform } from '@angular/core';

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

@Pipe({
  //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.
  name: "orderby"
})
export class OrderByPipe implements PipeTransform {
  transform(array:Array<any>, args?) {
    // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id
    if(array) {
      // get the first element
      let orderByValue = args[0]
      let byVal = 1
      // check if exclamation point 
      if(orderByValue.charAt(0) == "!") {
        // reverse the array
        byVal = -1
        orderByValue = orderByValue.substring(1)
      }
      console.log("byVal",byVal);
      console.log("orderByValue",orderByValue);

      array.sort((a: any, b: any) => {
        if(a[orderByValue] < b[orderByValue]) {
          return -1*byVal;
        } else if (a[orderByValue] > b[orderByValue]) {
          return 1*byVal;
        } else {
          return 0;
        }
      });
      return array;
    }
    //
  }
}

@Pipe({
  name : 'searchPipe',
})
export class SearchPipe implements PipeTransform {
  public transform(value, key: string, term: string) {
    return value.filter((item) => {
      if (item.hasOwnProperty(key)) {
        if (term) {
          let regExp = new RegExp('\\b' + term, 'gi');
          return regExp.test(item[key]);
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    GetPipe,
    FirstPipe,
    OrderByPipe,
    SearchPipe,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
