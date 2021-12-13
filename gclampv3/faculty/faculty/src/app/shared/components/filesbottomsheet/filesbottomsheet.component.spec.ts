import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesbottomsheetComponent } from './filesbottomsheet.component';

describe('FilesbottomsheetComponent', () => {
  let component: FilesbottomsheetComponent;
  let fixture: ComponentFixture<FilesbottomsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesbottomsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesbottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
