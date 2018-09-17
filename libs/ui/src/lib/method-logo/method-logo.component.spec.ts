import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodLogoComponent } from './method-logo.component';

describe('MethodIconPresenterComponent', () => {
  let component: MethodLogoComponent;
  let fixture: ComponentFixture<MethodLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodLogoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodLogoComponent);
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
