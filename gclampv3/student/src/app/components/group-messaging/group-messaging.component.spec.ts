import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMessagingComponent } from './group-messaging.component';

describe('GroupMessagingComponent', () => {
  let component: GroupMessagingComponent;
  let fixture: ComponentFixture<GroupMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
