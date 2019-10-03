import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideDetailComponent } from './slide-detail.component';

describe('SlideDetailComponent', () => {
  let component: SlideDetailComponent;
  let fixture: ComponentFixture<SlideDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
