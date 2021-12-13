import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSubforumsComponent } from './crud-subforums.component';

describe('CrudSubforumsComponent', () => {
  let component: CrudSubforumsComponent;
  let fixture: ComponentFixture<CrudSubforumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudSubforumsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudSubforumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
