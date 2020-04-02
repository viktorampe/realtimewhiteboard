import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatProgressBarModule } from '@angular/material';
import { configureTestSuite } from 'ng-bullet';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatProgressBarModule],
      declarations: [ProgressBarComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
