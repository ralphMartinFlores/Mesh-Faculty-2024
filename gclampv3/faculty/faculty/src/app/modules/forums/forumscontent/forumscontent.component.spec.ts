import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumscontentComponent } from './forumscontent.component';

describe('ForumscontentComponent', () => {
  let component: ForumscontentComponent;
  let fixture: ComponentFixture<ForumscontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumscontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumscontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
