import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { EduContentTypeEnum } from '../../enums';
import { ContentActionsStudentService } from './content-actions-student.service';
import {
  ContentActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-actions.service.interface';

describe('ContentActionsStudentServiceInterface', () => {
  let contentActionsStudentService: ContentActionsServiceInterface;
  let contentOpener: ContentOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContentActionsStudentService,
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
    contentActionsStudentService = TestBed.get(ContentActionsStudentService);
    contentOpener = TestBed.get(CONTENT_OPENER_TOKEN);
  });

  it('should be created', inject(
    [ContentActionsStudentService],
    (service: ContentActionsStudentService) => {
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
            contentActionsStudentService.contentActionDictionary['openBoeke']
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.EXERCISE
          }),
          expected: [
            contentActionsStudentService.contentActionDictionary[
              'openEduContentAsExercise'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: true }),
          expected: [
            contentActionsStudentService.contentActionDictionary[
              'openEduContentAsStream'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: false }),
          expected: [
            contentActionsStudentService.contentActionDictionary[
              'openEduContentAsDownload'
            ]
          ]
        }
      ];
      tests.forEach(test =>
        expect(
          contentActionsStudentService.getActionsForEduContent(
            test.mockEduContent
          )
        ).toEqual(test.expected)
      );
    });
  });
});
