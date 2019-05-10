import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  BundleFixture,
  DalState,
  EduContentFixture,
  FavoriteActions,
  FavoriteFixture,
  HistoryInterface,
  LearningAreaFixture,
  TaskFixture
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../content/open-static-content.interface';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '../../scorm/scorm-exercise.service.interface';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkViewModel } from './quick-link.viewmodel';

// file.only
describe('QuickLinkViewModel', () => {
  let quickLinkViewModel: QuickLinkViewModel;
  let store: Store<DalState>;
  let router: Router;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule.withRoutes([
          {
            path: 'bundles/:area/:id',
            component: Component,
            pathMatch: 'full'
          },
          {
            path: 'tasks/:area/:id',
            component: Component,
            pathMatch: 'full'
          },
          {
            path: 'edu-content/:id',
            component: Component,
            pathMatch: 'full'
          },
          {
            path: 'edu-content/:id/term',
            component: Component,
            pathMatch: 'full'
          }
        ])
      ],
      providers: [
        Store,
        QuickLinkViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { previewExerciseFromUnlockedContent: jest.fn() }
        }
      ]
    });
    quickLinkViewModel = TestBed.get(QuickLinkViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(quickLinkViewModel).toBeDefined();
    });
  });

  describe('action handlers', () => {
    it('should dispatch an update favorite action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expectedAction = new FavoriteActions.UpdateFavorite({
        userId: 1,
        favorite: {
          id: 1,
          changes: { name: 'foo' }
        },
        useCustomErrorHandler: true
      });
      quickLinkViewModel.update(1, 'foo', QuickLinkTypeEnum.FAVORITES);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });
    it('should dispatch a delete favorite action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expectedAction = new FavoriteActions.DeleteFavorite({
        userId: 1,
        id: 1,
        useCustomErrorHandler: true
      });
      quickLinkViewModel.delete(1, QuickLinkTypeEnum.FAVORITES);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });
    it('should not dispatch if the mode is not supported ', () => {
      const spy = jest.spyOn(store, 'dispatch');
      quickLinkViewModel.delete(1, 'bar' as QuickLinkTypeEnum);
      quickLinkViewModel.update(1, 'foo', 'bar' as QuickLinkTypeEnum);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('open eduContent', () => {
    it('should navigate to the bundle', () => {
      const bundle = new BundleFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openBundle(bundle);

      expect(router.navigate).toHaveBeenCalledWith([
        '/bundles',
        bundle.learningAreaId,
        bundle.id
      ]);
    });

    it('should navigate to the task', () => {
      const task = new TaskFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openTask(task);

      expect(router.navigate).toHaveBeenCalledWith([
        '/tasks',
        task.learningAreaId,
        task.id
      ]);
    });

    it('should navigate to the learningarea', () => {
      const area = new LearningAreaFixture({
        id: 4
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openArea(area);

      expect(router.navigate).toHaveBeenCalledWith(['/edu-content', area.id]);
    });

    it('should open eduContent', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      quickLinkViewModel.openStaticContent(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent, undefined);
    });

    it('should open eduContent as a stream', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      quickLinkViewModel.openStaticContent(eduContent, true);

      expect(spy).toHaveBeenCalledWith(eduContent, true);
    });

    it('should open an exercise', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      quickLinkViewModel.openExercise(eduContent);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, false);
    });

    it('should open an exercise with solutions', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      quickLinkViewModel.openExercise(eduContent, true);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, true);
    });

    it('should open the searchterm page with favorite_id', () => {
      const favorite = new FavoriteFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openSearch(favorite, QuickLinkTypeEnum.FAVORITES);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/edu-content', favorite.learningAreaId, 'term'],
        { queryParams: { favorite_id: favorite.id } }
      );
    });

    it('should open the searchterm page with history_id', () => {
      // TODO replace FavoriteFixture with HistoryFixture when available
      const history = new FavoriteFixture({
        id: 4,
        learningAreaId: 7
      }) as HistoryInterface;
      router.navigate = jest.fn();

      quickLinkViewModel.openSearch(history, QuickLinkTypeEnum.HISTORY);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/edu-content', history.learningAreaId, 'term'],
        { queryParams: { history_id: history.id } }
      );
    });
  });
});
