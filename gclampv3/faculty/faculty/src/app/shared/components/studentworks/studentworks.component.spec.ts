import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentworksComponent } from './studentworks.component';

describe('StudentworksComponent', () => {
  let component: StudentworksComponent;
  let fixture: ComponentFixture<StudentworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentworksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
