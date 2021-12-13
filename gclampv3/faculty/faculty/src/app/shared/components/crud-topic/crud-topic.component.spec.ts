import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTopicComponent } from './crud-topic.component';

describe('CrudTopicComponent', () => {
  let component: CrudTopicComponent;
  let fixture: ComponentFixture<CrudTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
