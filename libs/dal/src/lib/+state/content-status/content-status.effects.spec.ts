import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { ContentStatusReducer } from '.';
import { STUDENT_CONTENT_STATUS_SERVICE_TOKEN } from '../../student-content-status/student-content-status.service.interface';
import {
  ContentStatusesLoaded,
  ContentStatusesLoadError,
  LoadContentStatuses
} from './content-status.actions';
import { ContentStatusesEffects } from './content-status.effects';

describe('ContentStatusEffects', () => {
  let actions: Observable<any>;
  let effects: ContentStatusesEffects;
  let usedState: any;

  const expectInAndOut = (
    effect: Observable<any>,
    triggerAction: Action,
    effectOutput: any
  ) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effect).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  const expectInNoOut = (effect: Observable<any>, triggerAction: Action) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effect).toBeObservable(hot('---|'));
  };

  const mockServiceMethodReturnValue = (
    method: string,
    returnValue: any,
    service: any = STUDENT_CONTENT_STATUS_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = STUDENT_CONTENT_STATUS_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          ContentStatusReducer.NAME,
          ContentStatusReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([ContentStatusesEffects])
      ],
      providers: [
        {
          provide: STUDENT_CONTENT_STATUS_SERVICE_TOKEN,
          useValue: {
            getAllContentStatuses: () => {}
          }
        },
        ContentStatusesEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(ContentStatusesEffects);
  });

  describe('loadContentStatus$', () => {
    const unforcedLoadAction = new LoadContentStatuses({});
    const forcedLoadAction = new LoadContentStatuses({ force: true });
    const filledLoadedAction = new ContentStatusesLoaded({
      contentStatuses: []
    });
    const loadErrorAction = new ContentStatusesLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = ContentStatusReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllContentStatuses', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...ContentStatusReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllContentStatuses', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadContentStatuses$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = ContentStatusReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllContentStatuses', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...ContentStatusReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllContentStatuses', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadContentStatuses$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadContentStatuses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
