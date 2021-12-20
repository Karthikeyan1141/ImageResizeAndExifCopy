import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export default class CopyExifService {
  
  constructor() { }
  
  KEY_STR = "ABCDEFGHIJKLMNOP" +
            "QRSTUVWXYZabcdef" +
            "ghijklmnopqrstuv" +
            "wxyz0123456789+/" +
            "=";

  encode64(input : any): string {
    var output = "",
            chr1, chr2, chr3 = "",
            enc1, enc2, enc3, enc4 = "",
            i = 0;

        do {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 as any >> 6);
            enc4 = chr3 as any & 63;

            if (isNaN(chr2)) {
               enc3 = enc4 = 64 as any;
            } else if (isNaN(chr3 as any)) {
               enc4 = 64 as any;
            }

            output = output +
               this.KEY_STR.charAt(enc1) +
               this.KEY_STR.charAt(enc2) +
               this.KEY_STR.charAt(enc3) +
               this.KEY_STR.charAt(enc4 as any);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
  }                  

  getExifArray(segments : any): any{
    var seg;
    for (var x = 0; x < segments.length; x++)
    {
        seg = segments[x];
        if (seg[0] == 255 && seg[1] == 225) //(ff e1)
        {
            return seg;
        }
    }
    return [];
  }

  decode64(input : any) : any{
    var output = "",
            chr1, chr2, chr3 = "",
            enc1, enc2, enc3, enc4 = "",
            i = 0,
            buf = [];

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                  "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                  "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.KEY_STR.indexOf(input.charAt(i++));
            enc2 = this.KEY_STR.indexOf(input.charAt(i++));
            enc3 = this.KEY_STR.indexOf(input.charAt(i++));
            enc4 = this.KEY_STR.indexOf(input.charAt(i++)) as any;

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = (((enc3 & 3) << 6) | enc4 as any) as any;

            buf.push(chr1);

            if (enc3 != 64) {
               buf.push(chr2);
            }
            if (enc4 != 64 as any) {
               buf.push(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return buf;
  }

  insertExif(resizedFileBase64 : any, exifArray : any, mime : string) : any {
    var base64Start = "data:" + mime + ";base64,";
    var imageData = resizedFileBase64.replace("data:image/jpeg;base64,", ""),
    buf = this.decode64(imageData),
    separatePoint = buf.indexOf(255,3),
    mae = buf.slice(0, separatePoint),
    ato = buf.slice(separatePoint),
    array = mae;

    array = array.concat(exifArray);
    array = array.concat(ato);
    return array;
  }

  slice2Segments(rawImageArray : any) : any{
    var head = 0,
            segments = [];

        while (1)
        {
            if (rawImageArray[head] == 255 && rawImageArray[head + 1] == 218){break;}
            if (rawImageArray[head] == 255 && rawImageArray[head + 1] == 216)
            {
                head += 2;
            }
            else
            {
                var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3],
                    endPoint = head + length + 2,
                    seg = rawImageArray.slice(head, endPoint);
                segments.push(seg);
                head = endPoint;
            }
            if (head > rawImageArray.length){break;}
        }

        return segments;
  }

  exifManipulation(resizedFileBase64: any, segments: any, mime: string) : any {
    var exifArray = this.getExifArray(segments),
    newImageArray = this.insertExif(resizedFileBase64, exifArray, mime),
    aBuffer = new Uint8Array(newImageArray);

    return aBuffer;
  }

  restore(origFileBase64: any, resizedFileBase64: any, mime: string): any{
    var base64Start = "data:" + mime + ";base64,";
    if (!origFileBase64.match("data:image/jpeg;base64,"))
    {
      return resizedFileBase64;
    }       
    
    var rawImage = this.decode64(origFileBase64.replace("data:image/jpeg;base64,", ""));
    var segments = this.slice2Segments(rawImage);
            
    var image = this.exifManipulation(resizedFileBase64, segments, mime);
    
    return this.encode64(image);
  }

}
