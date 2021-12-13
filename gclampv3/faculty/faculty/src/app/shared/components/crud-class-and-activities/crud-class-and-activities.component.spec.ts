import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDClassAndActivitiesComponent } from './crud-class-and-activities.component';

describe('CRUDClassAndActivitiesComponent', () => {
  let component: CRUDClassAndActivitiesComponent;
  let fixture: ComponentFixture<CRUDClassAndActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRUDClassAndActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRUDClassAndActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
