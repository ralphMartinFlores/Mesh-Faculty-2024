import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopdialogComponent } from './shopdialog.component';

describe('ShopdialogComponent', () => {
  let component: ShopdialogComponent;
  let fixture: ComponentFixture<ShopdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
