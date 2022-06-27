import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWorksComponent } from './student-works.component';

describe('StudentWorksComponent', () => {
  let component: StudentWorksComponent;
  let fixture: ComponentFixture<StudentWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
