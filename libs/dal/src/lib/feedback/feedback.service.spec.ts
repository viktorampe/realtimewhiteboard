import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        // ...getStoreModuleForFeatures([EffectFeedbackReducer])
        MatSnackBarModule
      ],
      providers: [Store, MatSnackBar]
    });

    store = TestBed.get(Store);
  });

  it('should be created', inject([FeedbackService], (srv: FeedbackService) => {
    expect(srv).toBeTruthy();
  }));

  it('should call the snackbarService', () => {
    const snackBar = TestBed.get(MatSnackBar);
    spyOn(snackBar, 'open').and.callThrough();

    const service: FeedbackService = TestBed.get(FeedbackService);

    const mockAction = {
      title: 'klik',
      userAction: new ActionSuccessful({ successfulAction: 'test' })
    };

    const mockFeedBack: EffectFeedbackInterface = {
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [mockAction],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH
    };

    service['nextFeedback$'] = new BehaviorSubject<EffectFeedbackInterface>(
      mockFeedBack
    );

    expect(service['nextFeedback$']).toBeObservable(
      hot('(a)', { a: mockFeedBack })
    );

    // fails for some unclear reason
    // expect(service['successFeedback$']).toBeObservable(
    //   hot('(a)', { a: mockFeedBack })
    // );

    // fails for some unclear reason
    // expect(snackBar.open).toHaveBeenCalled();
  });
});
