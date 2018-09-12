import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodIconPresenterComponent } from './method-icon-presenter.component';

describe('MethodIconPresenterComponent', () => {
  let component: MethodIconPresenterComponent;
  let fixture: ComponentFixture<MethodIconPresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodIconPresenterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodIconPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without any inputs', () => {
    expect(component).toBeTruthy();
  });

  it('should create with any methodClass ', () => {
    component.methodClass = 'definitely-wrong-classname';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with colorMode grey', () => {
    component.colorMode = 'grey';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with colorMode color', () => {
    component.colorMode = 'color';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with colorMode hover', () => {
    component.colorMode = 'hover';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
