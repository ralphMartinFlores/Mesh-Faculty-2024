import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudActivityComponent } from './crud-activity.component';

describe('CrudActivityComponent', () => {
  let component: CrudActivityComponent;
  let fixture: ComponentFixture<CrudActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
