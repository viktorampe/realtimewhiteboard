import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { PracticeOverviewComponent } from './practice-overview.component';

describe('PracticeOverviewComponent', () => {
  let component: PracticeOverviewComponent;
  let fixture: ComponentFixture<PracticeOverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeOverviewComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
