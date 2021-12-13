import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudQuizComponent } from './crud-quiz.component';

describe('CrudQuizComponent', () => {
  let component: CrudQuizComponent;
  let fixture: ComponentFixture<CrudQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
