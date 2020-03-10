import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { CollapsibleContainerComponent } from './collapsible-container.component';

describe('CollapsibleContainerComponent', () => {
  let component: CollapsibleContainerComponent;
  let fixture: ComponentFixture<CollapsibleContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [CollapsibleContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
