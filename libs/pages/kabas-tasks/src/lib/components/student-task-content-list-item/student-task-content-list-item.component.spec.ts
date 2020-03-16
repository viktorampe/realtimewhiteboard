import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskContentListItemComponent } from './student-task-content-list-item.component';

describe('StudentTaskContentListItemComponent', () => {
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
