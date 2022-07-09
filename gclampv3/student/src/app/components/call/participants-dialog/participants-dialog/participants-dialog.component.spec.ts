import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsDialogComponent } from './participants-dialog.component';

describe('ParticipantsDialogComponent', () => {
  let component: ParticipantsDialogComponent;
  let fixture: ComponentFixture<ParticipantsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
