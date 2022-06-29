import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScheduleModalComponent } from './view-schedule-modal.component';

describe('ViewScheduleModalComponent', () => {
  let component: ViewScheduleModalComponent;
  let fixture: ComponentFixture<ViewScheduleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScheduleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
