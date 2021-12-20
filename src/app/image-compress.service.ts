import { Injectable } from '@angular/core';

declare var ExifRestorer: any;

var max_width = 1024;
var max_height = 1024;

@Injectable({
  providedIn: 'root'
})
export default class ImageCompressService {
  exif: any;
  constructor() { }


  base64toBlob(base64Data: string, contentType: string) : Blob{
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = window.atob(base64Data);
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

  Compress(img: CanvasImageSource, type : string) : string{
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

  convertBlobToBase64 = async (blob: any) => { // blob data
    return await this.blobToBase64(blob);
  }
  
  blobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

}
