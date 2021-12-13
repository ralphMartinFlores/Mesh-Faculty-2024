import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassfeedComponent } from './classfeed.component';

describe('ClassfeedComponent', () => {
  let component: ClassfeedComponent;
  let fixture: ComponentFixture<ClassfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassfeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
