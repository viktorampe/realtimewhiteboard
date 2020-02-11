import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { EduContentTypeEnum } from '../../enums';
import { ContentActionsService } from './content-actions.service';
import {
  ContentActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-actions.service.interface';

describe('ContentActionsServiceInterface', () => {
  let contentActionsService: ContentActionsServiceInterface;
  let contentOpener: ContentOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContentActionsService,
        {
          provide: CONTENT_OPENER_TOKEN,
          useValue: {
            openEduContentAsExercise: () => {},
            openEduContentAsSolution: () => {},
            openEduContentAsStream: () => {},
            openEduContentAsDownload: () => {},
            openBoeke: () => {},
            previewEduContentAsImage: () => {},
            addToTask: () => {},
            removeFromTask: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    contentActionsService = TestBed.get(ContentActionsService);
    contentOpener = TestBed.get(CONTENT_OPENER_TOKEN);
  });

  it('should be created', inject(
    [ContentActionsService],
    (service: ContentActionsService) => {
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
          expected: [contentActionsService.contentActionDictionary['openBoeke']]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.EXERCISE
          }),
          expected: [
            contentActionsService.contentActionDictionary[
              'openEduContentAsExercise'
            ],
            contentActionsService.contentActionDictionary[
              'openEduContentAsSolution'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: true }),
          expected: [
            contentActionsService.contentActionDictionary[
              'openEduContentAsStream'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: false }),
          expected: [
            contentActionsService.contentActionDictionary[
              'openEduContentAsDownload'
            ]
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.PAPER_EXERCISE
          }),
          expected: [
            contentActionsService.contentActionDictionary[
              'previewEduContentAsImage'
            ]
          ]
        }
      ];
      tests.forEach(test =>
        expect(
          contentActionsService.getActionsForEduContent(test.mockEduContent)
        ).toEqual(test.expected)
      );
    });
  });
  describe('getTaskActionsForEduContent()', () => {
    it('should return addToTask action when inTask false', () => {
      expect(
        contentActionsService.getTaskActionsForEduContent(
          new EduContentFixture(),
          false
        )
      ).toEqual([contentActionsService.contentActionDictionary['addToTask']]);
    });

    it('should return removeFromTask action when inTask true', () => {
      expect(
        contentActionsService.getTaskActionsForEduContent(
          new EduContentFixture(),
          true
        )
      ).toEqual([
        contentActionsService.contentActionDictionary['removeFromTask']
      ]);
    });
  });
});
