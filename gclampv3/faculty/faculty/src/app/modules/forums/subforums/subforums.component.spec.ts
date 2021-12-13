import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubforumsComponent } from './subforums.component';

describe('SubforumsComponent', () => {
  let component: SubforumsComponent;
  let fixture: ComponentFixture<SubforumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubforumsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubforumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
