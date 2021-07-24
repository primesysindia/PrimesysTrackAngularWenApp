import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPatrolmenExistingBeatsComponent } from './all-patrolmen-existing-beats.component';

describe('AllPatrolmenExistingBeatsComponent', () => {
  let component: AllPatrolmenExistingBeatsComponent;
  let fixture: ComponentFixture<AllPatrolmenExistingBeatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPatrolmenExistingBeatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPatrolmenExistingBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
