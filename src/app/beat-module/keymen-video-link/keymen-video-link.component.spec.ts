import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymenVideoLinkComponent } from './keymen-video-link.component';

describe('KeymenVideoLinkComponent', () => {
  let component: KeymenVideoLinkComponent;
  let fixture: ComponentFixture<KeymenVideoLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymenVideoLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymenVideoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
