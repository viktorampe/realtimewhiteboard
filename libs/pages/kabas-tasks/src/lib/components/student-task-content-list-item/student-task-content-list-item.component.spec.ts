import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskContentListItemComponent } from './student-task-content-list-item.component';

describe('StudentTaskListItemContentComponent', () => {
  let component: StudentTaskContentListItemComponent;
  let fixture: ComponentFixture<StudentTaskContentListItemComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [StudentTaskContentListItemComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(StudentTaskContentListItemComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
