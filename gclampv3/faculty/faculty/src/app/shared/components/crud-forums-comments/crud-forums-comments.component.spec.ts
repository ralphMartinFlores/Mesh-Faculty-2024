import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudForumsCommentsComponent } from './crud-forums-comments.component';

describe('CrudForumsCommentsComponent', () => {
  let component: CrudForumsCommentsComponent;
  let fixture: ComponentFixture<CrudForumsCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudForumsCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudForumsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
