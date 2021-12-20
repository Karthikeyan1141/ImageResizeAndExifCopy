import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeAndExifCopyComponent } from './resize-and-exif-copy.component';

describe('ResizeAndExifCopyComponent', () => {
  let component: ResizeAndExifCopyComponent;
  let fixture: ComponentFixture<ResizeAndExifCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeAndExifCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeAndExifCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
