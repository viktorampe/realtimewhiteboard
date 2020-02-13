import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { ContentTaskActionsService } from './content-task-actions.service';
import {
  ContentTaskActionsServiceInterface,
  ContentTaskManagerInterface,
  CONTENT_TASK_MANAGER_TOKEN
} from './content-task-actions.service.interface';

describe('ContentTaskActionsService', () => {
  let contentTaskActionService: ContentTaskActionsServiceInterface;
  let contentTaskManager: ContentTaskManagerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContentTaskActionsService,
        {
          provide: CONTENT_TASK_MANAGER_TOKEN,
          useValue: {
            addEduContentToTask: () => {},
            removeEduContentFromTask: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    contentTaskActionService = TestBed.get(ContentTaskActionsService);
    contentTaskManager = TestBed.get(CONTENT_TASK_MANAGER_TOKEN);
  });

  it('should be created', inject(
    [ContentTaskActionsService],
    (service: ContentTaskActionsService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getTaskActionsForEduContent()', () => {
    it('should return addToTask action when inTask false', () => {
      expect(
        contentTaskActionService.getTaskActionsForEduContent(
          new EduContentFixture(),
          false
        )
      ).toEqual([
        contentTaskActionService.contentTaskActionDictionary.addToTask
      ]);
    });

    it('should return removeFromTask action when inTask true', () => {
      expect(
        contentTaskActionService.getTaskActionsForEduContent(
          new EduContentFixture(),
          true
        )
      ).toEqual([
        contentTaskActionService.contentTaskActionDictionary.removeFromTask
      ]);
    });
  });
});
