import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataOnlyComponent } from './view-data-only.component';

describe('ViewDataOnlyComponent', () => {
  let component: ViewDataOnlyComponent;
  let fixture: ComponentFixture<ViewDataOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDataOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDataOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
