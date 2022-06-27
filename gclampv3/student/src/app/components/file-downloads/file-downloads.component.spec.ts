import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloadsComponent } from './file-downloads.component';

describe('FileDownloadsComponent', () => {
  let component: FileDownloadsComponent;
  let fixture: ComponentFixture<FileDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDownloadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
