import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeOverviewComponent } from './practice-overview.component';

describe('PracticeOverviewComponent', () => {
  let component: PracticeOverviewComponent;
  let fixture: ComponentFixture<PracticeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
