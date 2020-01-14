import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AddAssigneeComponent } from './add-assignee.component';

describe('AddAssigneeComponent', () => {
  let component: AddAssigneeComponent;
  let fixture: ComponentFixture<AddAssigneeComponent>;
  beforeEach(async(() => {
    configureTestSuite(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [AddAssigneeComponent],
        providers: []
      });
    });
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
