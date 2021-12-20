import { Component } from '@angular/core';
import {Renderer2, RendererFactory2} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'html5resize';
  preview: SafeUrl = '';
  sourceSize: string = '';
  compressedSize: string = '';
  private render: Renderer2;
  result: SafeUrl ='';

  constructor (private sanitizer: DomSanitizer, rendererFactory: RendererFactory2) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  async compressImage (event: any) {
    var selectedFile = event.target.files[0];
    const mime = selectedFile.type;
    
    if (!selectedFile) return
    this.preview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
    this.sourceSize = (selectedFile.size / 1024 / 1024).toFixed(2) + 'MB';
    
    var reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);

    reader.onload = (e) => {
      var blob = new Blob([e.target?.result as BlobPart]);
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob); 
      var image = new Image();
      image.src = blobURL;
      image.onload = () => {
        var resized = Compress(image,mime);
        var outputfileblob = dataURLtoBlob(resized);
        this.compressedSize = (outputfileblob.size / 1024 / 1024).toFixed(2) + 'MB';

        this.result = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(outputfileblob));
      }
    }

  }

}

function dataURLtoBlob(dataurl : any) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

var max_width = 1024;
var max_height = 1024;

function Compress(img: CanvasImageSource, type : string) {
  
  var canvas = document.createElement('canvas');

  var width  = Number(img.width);
  var height = Number(img.height);

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, width, height);
  
  
  return canvas.toDataURL(type,0.7); // get the data from canvas as 70%

}

