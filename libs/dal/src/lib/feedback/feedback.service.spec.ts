import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { MatSnackBar, MatSnackBarContainer } from '@angular/material/snack-bar';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { BehaviorSubject } from 'rxjs';
import { DalState } from '../+state';
import { ActionSuccessful } from '../+state/dal.actions';
import {
  EffectFeedbackInterface,
  FeedbackService,
  Priority
} from './feedback.service';

describe('FeedbackService', () => {
  let store: Store<DalState>;
  let mockFeedBack: EffectFeedbackInterface;
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        // ...getStoreModuleForFeatures([EffectFeedbackReducer])
        MatSnackBarModule
      ],
      providers: [Store, MatSnackBar],
      declarations: [MatSnackBarContainer]
    });

    store = TestBed.get(Store);
    service = TestBed.get(FeedbackService);
  });

  beforeAll(() => {
    const mockAction = {
      title: 'klik',
      userAction: new ActionSuccessful({ successfulAction: 'test' })
    };

    mockFeedBack = {
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [mockAction],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH
    };
  });

  describe('creation', () => {
    it('should be created', inject(
      [FeedbackService],
      (srv: FeedbackService) => {
        expect(srv).toBeTruthy();
      }
    ));
  });

  describe('success feedback', () => {
    let snackbar: MatSnackBar;

    beforeEach(() => {
      snackbar = TestBed.get(MatSnackBar);
    });

    it('should call the snackbarService', () => {
      snackbar.open = jest.fn();

      // will be handled differently when state can be mocked
      // TODO remove from here ...
      service['nextFeedback$'] = new BehaviorSubject<EffectFeedbackInterface>(
        mockFeedBack
      );

      // re-initialize streams
      service['setIntermediateStreams']();
      service['setPresentationStreams']();

      expect(service['successFeedback$']).toBeObservable(
        hot('a', { a: mockFeedBack })
      );

      // ... to here

      expect(snackbar.open).toHaveBeenCalled();
      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith(
        mockFeedBack.message,
        mockFeedBack.userActions[0].title,
        jasmine.anything()
      );
    });

    it('should use the default setings when calling the snackbar', () => {
      snackbar.open = jest.fn();

      const defaultSettings = service['snackbarConfig'];

      // will be handled differently when state can be mocked
      // TODO remove from here ...
      service['nextFeedback$'] = new BehaviorSubject<EffectFeedbackInterface>(
        mockFeedBack
      );

      // re-initialize streams
      service['setIntermediateStreams']();
      service['setPresentationStreams']();

      // ... to here

      expect(snackbar.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        defaultSettings
      );
    });

    it('should dispatch an action when the snackbar is dismissed without an action', () => {
      store.dispatch = jest.fn();
      const snackbarDismissTime = 1000;
      service['snackbarConfig'] = { duration: snackbarDismissTime };

      // mock the snackbar element
      // const mockSnackbarRef = new MatSnackBarRef<SimpleSnackBar>(
      //   new MatSnackBarContainer(null, null, null, service['snackbarConfig']),
      //   new OverlayRef(
      //     null,
      //     null,
      //     null,
      //     new OverlayConfig(),
      //     null,
      //     null,
      //     null,
      //     null
      //   )
      // );
      // snackbar.open = jest.fn().mockReturnValue(mockSnackbarRef);

      // will be handled differently when state can be mocked
      // TODO remove from here ...
      service['nextFeedback$'] = new BehaviorSubject<EffectFeedbackInterface>(
        mockFeedBack
      );

      // re-initialize streams
      service['setIntermediateStreams']();
      service['setPresentationStreams']();

      // ... to here

      expect(snackbar._openedSnackBarRef).toBeTruthy();
      snackbar.dismiss();

      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('error feedback', () => {
    beforeAll(() => {
      mockFeedBack.type = 'error';
    });

    it('should pass the error feedback to the banner-stream', () => {
      // will be handled differently when state can be mocked
      // TODO remove from here ...
      service['nextFeedback$'] = new BehaviorSubject<EffectFeedbackInterface>(
        mockFeedBack
      );

      // re-initialize streams
      service['setIntermediateStreams']();
      service['setPresentationStreams']();

      expect(service['errorFeedback$']).toBeObservable(
        hot('a', { a: mockFeedBack })
      );

      // ... to here

      expect(service.bannerFeedback$).toBeObservable(
        hot('a', { a: mockFeedBack })
      );
    });
  });
});
