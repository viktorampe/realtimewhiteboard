import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import {
  DalActions,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  EffectFeedbackReducer,
  Priority,
  StateFeatureBuilder
} from '@campus/dal';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '@campus/shared';
import { Action, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { AppViewModel } from './app.viewmodel';

describe('AppViewModel', () => {
  let viewModel: AppViewModel;
  let store: Store<DalState>;
  let mockFeedBack: EffectFeedbackInterface;
  let mockAction: Action;
  let storeSpy: jest.SpyInstance;
  let breakpointSubject: BehaviorSubject<BreakpointState>;
  let feedbackService: FeedBackServiceInterface;

  beforeAll(() => {
    mockFeedBack = new EffectFeedbackFixture({
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [
        {
          title: 'klik',
          userAction: mockAction
        }
      ],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH,
      useDefaultCancel: false
    });

    mockAction = new DalActions.ActionSuccessful({
      successfulAction: 'test'
    });
  });

  configureTestSuite(() => {
    breakpointSubject = new BehaviorSubject<BreakpointState>(<BreakpointState>{
      matches: false
    });

    const fakeObserve = () => breakpointSubject.asObservable();

    const breakpointSpy = { observe: jest.fn() };
    breakpointSpy.observe.mockImplementation(fakeObserve);

    TestBed.configureTestingModule({
      imports: [
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          EffectFeedbackReducer
        ]),
        StoreModule.forRoot({})
      ],
      providers: [
        AppViewModel,
        Store,
        { provide: BreakpointObserver, useValue: breakpointSpy },
        {
          provide: FEEDBACK_SERVICE_TOKEN,
          useValue: {
            addDefaultCancelButton: () => mockFeedBack,
            openSnackbar: () => ({
              snackbarRef: {},
              feedback: mockFeedBack
            }),
            snackbarAfterDismiss: () =>
              of({
                actionToDispatch: mockAction,
                feedback: mockFeedBack
              })
          }
        }
      ]
    });

    viewModel = TestBed.get(AppViewModel);
    store = TestBed.get(Store);
    feedbackService = TestBed.get(FEEDBACK_SERVICE_TOKEN);
  });

  beforeEach(() => {
    storeSpy = jest.spyOn(store, 'dispatch');
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(viewModel).toBeDefined();
    });
  });

  describe('feedback', () => {
    describe('success feedback', () => {
      beforeAll(() => {
        mockFeedBack.type = 'success';
      });

      it('should pass the success feedback to the feedbackService', () => {
        jest.spyOn(feedbackService, 'openSnackbar');

        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        expect(feedbackService.openSnackbar).toHaveBeenCalled();
        expect(feedbackService.openSnackbar).toHaveBeenCalledWith(mockFeedBack);
      });

      it('should subscribe to snackbarAfterDismiss', () => {
        jest.spyOn(viewModel, 'onFeedbackDismiss');

        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        // feedbackService.snackbarAfterDismiss is mocked and always emits a value

        expect(viewModel.onFeedbackDismiss).toHaveBeenCalled();
      });
    });

    // describe('error feedback', () => {
    //   beforeAll(() => {
    //     mockFeedBack.type = 'error';
    //   });

    //   it('should pass the error feedback to the banner-stream', () => {
    //     store.dispatch(
    //       new EffectFeedbackActions.AddEffectFeedback({
    //         effectFeedback: mockFeedBack
    //       })
    //     );

    //     expect(viewModel.bannerFeedback$).toBeObservable(
    //       hot('a', { a: mockFeedBack })
    //     );
    //   });
    // });

    describe('feedback event handling', () => {
      let mockEvent: { action: Action; feedbackId: string };
      let removeFeedbackAction: Action;

      beforeEach(() => {
        mockEvent = { action: mockAction, feedbackId: mockFeedBack.id };
      });

      it('should dispatch a removeFeedback action', () => {
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id,
          userAction: mockAction
        });
        viewModel.onFeedbackDismiss(mockEvent);

        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
      });

      it('should dispatch the event action, if available', () => {
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id,
          userAction: mockAction
        });
        // with action
        viewModel.onFeedbackDismiss(mockEvent);
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
        expect(store.dispatch).toHaveBeenCalledWith(mockEvent.action);

        // without action
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id
        });
        storeSpy.mockClear();
        const mockEventWithoutAction = {
          action: null,
          feedbackId: mockFeedBack.id
        };
        viewModel.onFeedbackDismiss(mockEventWithoutAction);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
      });
    });
  });
});
