import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { ManageTaskContentComponent } from './manage-task-content.component';

describe('ManageTaskContentComponent', () => {
  let component: ManageTaskContentComponent;
  let fixture: ComponentFixture<ManageTaskContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTaskContentComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
