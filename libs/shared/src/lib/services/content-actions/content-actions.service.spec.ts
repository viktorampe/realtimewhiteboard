import { inject, TestBed } from '@angular/core/testing';
import { EduContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { ContentActionsService } from './content-actions.service';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN,
  EduContentTypeEnum
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
            openBoeke: () => {}
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
          expected: [
            {
              label: 'Openen',
              icon: 'boeken',
              tooltip: 'Open het bordboek',
              handler: contentOpener.openBoeke
            } as ContentActionInterface
          ]
        },
        {
          mockEduContent: new EduContentFixture({
            type: EduContentTypeEnum.EXERCISE
          }),
          expected: [
            {
              label: 'Openen',
              icon: 'exercise:open',
              tooltip: 'Open oefening zonder oplossingen',
              handler: contentOpener.openEduContentAsExercise
            } as ContentActionInterface,
            {
              label: 'Toon oplossing',
              icon: 'exercise:finished',
              tooltip: 'Open oefening met oplossingen',
              handler: contentOpener.openEduContentAsSolution
            } as ContentActionInterface
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: true }),
          expected: [
            {
              label: 'Openen',
              icon: 'lesmateriaal',
              tooltip: 'Open het lesmateriaal',
              handler: contentOpener.openEduContentAsStream
            }
          ]
        },
        {
          mockEduContent: new EduContentFixture({}, { streamable: false }),
          expected: [
            {
              label: 'Downloaden',
              icon: 'download',
              tooltip: 'Download het lesmateriaal',
              handler: contentOpener.openEduContentAsDownload
            }
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
});
