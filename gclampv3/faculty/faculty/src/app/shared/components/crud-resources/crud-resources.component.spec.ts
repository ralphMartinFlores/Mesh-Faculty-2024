import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudResourcesComponent } from './crud-resources.component';

describe('CrudResourcesComponent', () => {
  let component: CrudResourcesComponent;
  let fixture: ComponentFixture<CrudResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
