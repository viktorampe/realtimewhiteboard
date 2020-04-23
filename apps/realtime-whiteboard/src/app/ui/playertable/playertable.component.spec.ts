import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayertableComponent } from './playertable.component';

describe('PlayertableComponent', () => {
  let component: PlayertableComponent;
  let fixture: ComponentFixture<PlayertableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayertableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
