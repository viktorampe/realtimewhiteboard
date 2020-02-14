import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { EduContentTypeEnum } from '../../../enums';
import { ContentOpenActionsStudentService } from './content-open-actions-student.service';
import {
  ContentOpenActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-open-actions.service.interface';

describe('ContentOpenActionsStudentServiceInterface', () => {
  let contentOpenActionsStudentService: ContentOpenActionsServiceInterface;
  let contentOpener: ContentOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContentOpenActionsStudentService,
        {
          provide: CONTENT_OPENER_TOKEN,
          useValue: {
            openEduContentAsExercise: () => {},
            openEduContentAsSolution: () => {},
            openEduContentAsStream: () => {},
            openEduContentAsDownload: () => {},
            openBoeke: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    contentOpenActionsStudentService = TestBed.get(
      ContentOpenActionsStudentService
    );
    contentOpener = TestBed.get(CONTENT_OPENER_TOKEN);
  });

  it('should be created', inject(
    [ContentOpenActionsStudentService],
    (service: ContentOpenActionsStudentService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getActionsForEduContent()', () => {
    it('should return all actions for the provided eduContent', () => {
      const tests = [
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.BOEKE
          }),
          expected: [
            contentOpenActionsStudentService.contentActionDictionary[
              'openBoeke'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.EXERCISE
          }),
          expected: [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsExercise'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: true }),
          expected: [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsStream'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: false }),
          expected: [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsDownload'
            ]
          ]
        }
      ];
      tests.forEach(test =>
        expect(
          contentOpenActionsStudentService.getActionsForEduContent(
            test.mockEduContent
          )
        ).toEqual(test.expected)
      );
    });
  });
});
