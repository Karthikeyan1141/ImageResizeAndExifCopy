import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare var ExifRestorer: any;

@Component({
  selector: 'app-exifcopy',
  templateUrl: './exifcopy.component.html',
  styleUrls: ['./exifcopy.component.css']
})
export class ExifcopyComponent implements OnInit {

  preview: SafeUrl = '';
  sourceSize: string = '';
  compressedSize: string = '';
  result: SafeUrl ='';
  exif: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  async compressImage (event: any) {
    var selectedFile = event.target.files[0];
    const mime = selectedFile.type;
    
    if (!selectedFile) return
    this.preview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
    this.sourceSize = (selectedFile.size / 1024 / 1024).toFixed(2) + 'MB';
    
    var reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    //reader.readAsDataURL(selectedFile);
    reader.onload = async (e) => {
      var blob = new Blob([e.target?.result as BlobPart], {type: mime}); 
      var originalbase64 = await convertBlobToBase64(blob);
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob);
      var image = new Image();
      image.src = blobURL;
      image.onload = () => {
        var resized = Compress(image,mime);
        resized = ExifRestorer.restore(originalbase64, resized);
        var outputfileblob = base64toBlob(resized, mime);
        this.compressedSize = (outputfileblob.size / 1024 / 1024).toFixed(2) + 'MB';

        this.result = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(outputfileblob));
      }
    }
    
  }

}

function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
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

const convertBlobToBase64 = async (blob: any) => { // blob data
  return await blobToBase64(blob);
}

const blobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


