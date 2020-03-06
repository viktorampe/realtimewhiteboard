import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { CollapsibleContainerComponent } from './collapsible-container.component';

describe('CollapsibleContainerComponent', () => {
  let component: CollapsibleContainerComponent;
  let fixture: ComponentFixture<CollapsibleContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
