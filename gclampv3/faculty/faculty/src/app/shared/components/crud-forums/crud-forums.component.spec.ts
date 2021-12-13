import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDForumsComponent } from './crud-forums.component';

describe('CRUDForumsComponent', () => {
  let component: CRUDForumsComponent;
  let fixture: ComponentFixture<CRUDForumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRUDForumsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRUDForumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
