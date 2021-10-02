import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Downloader} from '@ionic-native/downloader/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import {File} from '@ionic-native/file/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {Filesystem } from '@capacitor/filesystem';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Downloader,Zip,File,SQLite],
  bootstrap: [AppComponent],
})
export class AppModule {}
