import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCommentsComponent } from './crud-comments.component';

describe('CrudCommentsComponent', () => {
  let component: CrudCommentsComponent;
  let fixture: ComponentFixture<CrudCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
