import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyLoadingComponent } from './faculty-loading.component';

describe('FacultyLoadingComponent', () => {
  let component: FacultyLoadingComponent;
  let fixture: ComponentFixture<FacultyLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
