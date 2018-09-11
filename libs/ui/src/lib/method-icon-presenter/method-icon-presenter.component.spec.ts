import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodIconPresenterComponent } from './method-icon-presenter.component';

describe('MethodIconPresenterComponent', () => {
  let component: MethodIconPresenterComponent;
  let fixture: ComponentFixture<MethodIconPresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodIconPresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodIconPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
