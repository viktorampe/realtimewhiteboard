import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { EduContentBookReducer } from '.';
import { TOC_SERVICE_TOKEN } from '../../toc/toc.service.interface';
import {
  EduContentBooksLoaded,
  EduContentBooksLoadError,
  LoadEduContentBooks
} from './edu-content-book.actions';
import { EduContentBookEffects } from './edu-content-book.effects';

describe('EduContentBookEffects', () => {
  let actions: Observable<any>;
  let effects: EduContentBookEffects;
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
    service: any = TOC_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = TOC_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          EduContentBookReducer.NAME,
          EduContentBookReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EduContentBookEffects])
      ],
      providers: [
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        EduContentBookEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(EduContentBookEffects);
  });

  describe('loadEduContentBook$', () => {
    const unforcedLoadAction = new LoadEduContentBooks({ methodIds: [1] });
    const forcedLoadAction = new LoadEduContentBooks({
      force: true,
      methodIds: [1]
    });
    const filledLoadedAction = new EduContentBooksLoaded({
      eduContentBooks: []
    });
    const loadErrorAction = new EduContentBooksLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = EduContentBookReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getBooksByMethodIds', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...EduContentBookReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getBooksByMethodIds', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadEduContentBooks$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = EduContentBookReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getBooksByMethodIds', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...EduContentBookReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getBooksByMethodIds', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadEduContentBooks$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadEduContentBooks$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
