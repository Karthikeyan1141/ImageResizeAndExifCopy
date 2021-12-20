import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ExifcopyComponent } from './exifcopy/exifcopy.component';
import { ResizeAndExifCopyComponent } from './resize-and-exif-copy/resize-and-exif-copy.component';

@NgModule({
  declarations: [
    AppComponent,
    ExifcopyComponent,
    ResizeAndExifCopyComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ResizeAndExifCopyComponent]
})
export class AppModule { }
