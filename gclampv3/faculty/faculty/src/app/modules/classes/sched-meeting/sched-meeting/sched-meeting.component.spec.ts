import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedMeetingComponent } from './sched-meeting.component';

describe('SchedMeetingComponent', () => {
  let component: SchedMeetingComponent;
  let fixture: ComponentFixture<SchedMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
