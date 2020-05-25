import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarddetailitemComponent } from './carddetailitem.component';

describe('CarddetailitemComponent', () => {
  let component: CarddetailitemComponent;
  let fixture: ComponentFixture<CarddetailitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarddetailitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarddetailitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
