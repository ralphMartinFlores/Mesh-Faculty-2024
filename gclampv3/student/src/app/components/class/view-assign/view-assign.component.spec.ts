import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignComponent } from './view-assign.component';

describe('ViewAssignComponent', () => {
  let component: ViewAssignComponent;
  let fixture: ComponentFixture<ViewAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
