import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExifcopyComponent } from './exifcopy.component';

describe('ExifcopyComponent', () => {
  let component: ExifcopyComponent;
  let fixture: ComponentFixture<ExifcopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExifcopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExifcopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
