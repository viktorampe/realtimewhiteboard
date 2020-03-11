import { inject, TestBed } from '@angular/core/testing';
import {
  EduContentFixture,
  ResultFixture,
  ResultStatus,
  TaskInstanceFixture
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { EduContentTypeEnum } from '../../../enums';
import { ContentOpenActionsStudentService } from './content-open-actions-student.service';
import {
  ContentOpenActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-open-actions.service.interface';

describe('ContentOpenActionsStudentServiceInterface', () => {
  const dateYesterday = new Date('9 january 2010');
  const dateToday = new Date('10 january 2010');
  const dateTomorrow = new Date('11 january 2010');

  let contentOpenActionsStudentService: ContentOpenActionsServiceInterface;
  let contentOpener: ContentOpenerInterface;
  let dateMock: MockDate;

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

  beforeAll(() => {
    dateMock = new MockDate(dateToday);
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  it('should be created', inject(
    [ContentOpenActionsStudentService],
    (service: ContentOpenActionsStudentService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getActionsForTaskInstanceEduContent', () => {
    describe('should return the correct actions', () => {
      const mockEduContentExercise = new EduContentFixture({
        type: EduContentTypeEnum.EXERCISE
      });

      const tests = [
        {
          it: 'not an exercise - default action',
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.LINK
          }),
          mockTaskInstance: new TaskInstanceFixture({
            end: dateTomorrow
          }),
          mockResult: new ResultFixture(),
          expected: () => [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsDownload'
            ]
          ]
        },
        {
          it: 'exercise expired - solution',
          mockEduContent: mockEduContentExercise,
          mockTaskInstance: new TaskInstanceFixture({
            end: dateYesterday
          }),
          mockResult: new ResultFixture(),
          expected: () => [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsSolution'
            ]
          ]
        },
        {
          it: 'exercise incomplete - continue',
          mockEduContent: mockEduContentExercise,
          mockTaskInstance: new TaskInstanceFixture({
            end: dateTomorrow
          }),
          mockResult: new ResultFixture({
            status: ResultStatus.STATUS_INCOMPLETE
          }),
          expected: () => [
            contentOpenActionsStudentService.contentActionDictionary[
              'continueEduContentAsExercise'
            ]
          ]
        },
        {
          it: 'exercise complete and not expired - nothing',
          mockEduContent: mockEduContentExercise,
          mockTaskInstance: new TaskInstanceFixture({
            end: dateTomorrow
          }),
          mockResult: new ResultFixture({
            status: ResultStatus.STATUS_COMPLETED
          }),
          expected: () => []
        },
        {
          it: 'exercise not started - open',
          mockEduContent: mockEduContentExercise,
          mockTaskInstance: new TaskInstanceFixture({
            end: dateTomorrow
          }),
          mockResult: new ResultFixture({
            status: ResultStatus.STATUS_NOT_ATTEMPTED
          }),
          expected: () => [
            contentOpenActionsStudentService.contentActionDictionary[
              'openEduContentAsExercise'
            ]
          ]
        }
      ];

      tests.forEach(test =>
        it(test.it, () => {
          expect(
            contentOpenActionsStudentService.getActionsForTaskInstanceEduContent(
              test.mockEduContent,
              test.mockResult,
              test.mockTaskInstance
            )
          ).toEqual(test.expected());
        })
      );
    });
  });

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
