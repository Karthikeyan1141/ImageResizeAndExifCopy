import { TestBed } from '@angular/core/testing';

import { CopyExifService } from './copy-exif.service';

describe('CopyExifService', () => {
  let service: CopyExifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyExifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
