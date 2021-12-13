import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudNewsCommentsComponent } from './crud-news-comments.component';

describe('CrudNewsCommentsComponent', () => {
  let component: CrudNewsCommentsComponent;
  let fixture: ComponentFixture<CrudNewsCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudNewsCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudNewsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
