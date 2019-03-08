import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevpolComponent } from './devpol.component';

describe('DevpolComponent', () => {
  let component: DevpolComponent;
  let fixture: ComponentFixture<DevpolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevpolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevpolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
