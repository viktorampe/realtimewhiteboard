import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouforplayingComponent } from './thankyouforplaying.component';

describe('ThankyouforplayingComponent', () => {
  let component: ThankyouforplayingComponent;
  let fixture: ComponentFixture<ThankyouforplayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankyouforplayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouforplayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
