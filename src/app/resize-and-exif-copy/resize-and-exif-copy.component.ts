import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CompressionService  from "src/app/image-compress.service";

declare var ExifRestorer: any;

@Component({
  selector: 'app-resize-and-exif-copy',
  templateUrl: './resize-and-exif-copy.component.html',
  styleUrls: ['./resize-and-exif-copy.component.css']
})
export class ResizeAndExifCopyComponent implements OnInit {
  
  preview: SafeUrl = '';
  sourceSize: string = '';
  compressedSize: string = '';
  result: SafeUrl ='';
  exif: any;

  constructor(private sanitizer: DomSanitizer, private compressionService: CompressionService) { }

  ngOnInit(): void {
  }

  async compressImage (event: any) {
    var selectedFile = event.target.files[0];
    if (!selectedFile) return
    const mime = selectedFile.type;
    this.preview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
    this.sourceSize = (selectedFile.size / 1024 / 1024).toFixed(2) + 'MB';
    var reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = async (e) => {
      var blob = new Blob([e.target?.result as BlobPart], {type: mime});
      var originalbase64 = await this.compressionService.convertBlobToBase64(blob);
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob);
      var image = new Image();
      image.src = blobURL;
      image.onload = () => {
        var resized = this.compressionService.Compress(image,mime);
        resized = ExifRestorer.restore(originalbase64, resized, mime);
        var outputfileblob = this.compressionService.base64toBlob(resized, mime);
        this.compressedSize = (outputfileblob.size / 1024 / 1024).toFixed(2) + 'MB';

        this.result = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(outputfileblob));
      }
    }
  }

}
