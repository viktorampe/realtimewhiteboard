import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { EduContentTypeEnum } from '../../../enums';
import { ContentOpenActionsService } from './content-open-actions.service';
import {
  ContentOpenActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-open-actions.service.interface';

describe('ContentOpenActionsServiceInterface', () => {
  let contentOpenActionsService: ContentOpenActionsServiceInterface;
  let contentOpener: ContentOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContentOpenActionsService,
        {
          provide: CONTENT_OPENER_TOKEN,
          useValue: {
            openEduContentAsExercise: () => {},
            openEduContentAsSolution: () => {},
            openEduContentAsStream: () => {},
            openEduContentAsDownload: () => {},
            openBoeke: () => {},
            previewEduContentAsImage: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    contentOpenActionsService = TestBed.get(ContentOpenActionsService);
    contentOpener = TestBed.get(CONTENT_OPENER_TOKEN);
  });

  it('should be created', inject(
    [ContentOpenActionsService],
    (service: ContentOpenActionsService) => {
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
            contentOpenActionsService.contentActionDictionary.openBoeke
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.EXERCISE
          }),
          expected: [
            contentOpenActionsService.contentActionDictionary
              .openEduContentAsExercise,
            contentOpenActionsService.contentActionDictionary
              .openEduContentAsSolution
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: true }),
          expected: [
            contentOpenActionsService.contentActionDictionary
              .openEduContentAsStream
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: false }),
          expected: [
            contentOpenActionsService.contentActionDictionary
              .openEduContentAsDownload
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.PAPER_EXERCISE
          }),
          expected: [
            contentOpenActionsService.contentActionDictionary
              .previewEduContentAsImage
          ]
        }
      ];
      tests.forEach(test =>
        expect(
          contentOpenActionsService.getActionsForEduContent(test.mockEduContent)
        ).toEqual(test.expected)
      );
    });
  });
});
