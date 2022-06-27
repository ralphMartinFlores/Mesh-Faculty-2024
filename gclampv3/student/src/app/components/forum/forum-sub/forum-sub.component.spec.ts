import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumSubComponent } from './forum-sub.component';

describe('ForumSubComponent', () => {
  let component: ForumSubComponent;
  let fixture: ComponentFixture<ForumSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
