# BeatMap

BeatMap allows user to discover and create playlists based on location and activity. This app is build with [https://angular.io/] (Angular 4) and [https://github.com/angular/angularfire2] (AngularFire2), and was initially generated with [https://github.com/angular/angular-cli] (Angular CLI). BeatMap relies heavily on the [https://developers.soundcloud.com/docs/api/guide] (SoundCloud API) to search for music, and utilizes [http://www.schillmania.com/projects/soundmanager2/] (SoundManager2) for creating playlists and playing tracks.

## Installation

Ensure you have Node and NPM installed using the instructions at:

[https://nodejs.org/download/](https://nodejs.org/download/)

Install the project dependancies using:

    npm install

To enable use of a Firebase database, create a project on Firebase and add the following to app.module.ts:

    export const firebaseConfig = {
        apiKey: 'ABC123',
        authDomain: 'yourapp.firebaseapp.com',
        databaseURL: 'https://yourapp.firebaseio.com',
        storageBucket: 'yourapp.appspot.com',
        messagingSenderId: '01234'
    };

Install the necessary Firebase files using:

    firebase init

## Usage
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Build
Update firebase.json to use 'dist' as the public hosting directory then run:

    firebase deploy

## Directory structure

    src/                       --> Frontend sources files
    e2e/                       --> End to end tests using Protractor

## Contact

For more information please contact alexabbott