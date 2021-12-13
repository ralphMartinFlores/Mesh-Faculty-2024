import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentSumbmissionComponent } from './view-student-sumbmission.component';

describe('ViewStudentSumbmissionComponent', () => {
  let component: ViewStudentSumbmissionComponent;
  let fixture: ComponentFixture<ViewStudentSumbmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentSumbmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentSumbmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
