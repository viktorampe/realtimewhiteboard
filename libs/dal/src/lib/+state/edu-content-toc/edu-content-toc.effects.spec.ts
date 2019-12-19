import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { EduContentTocReducer } from '.';
import { TOC_SERVICE_TOKEN } from '../../toc/toc.service.interface';
import { AddEduContentTocsForBook, AddLoadedBook, EduContentTocsLoadError, LoadEduContentTocsForBook } from './edu-content-toc.actions';
import { EduContentTocEffects } from './edu-content-toc.effects';

describe('EduContentTocEffects', () => {
  let actions: Observable<any>;
  let effects: EduContentTocEffects;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        StoreModule.forFeature(
          EduContentTocReducer.NAME,
          EduContentTocReducer.reducer,
          { initialState: usedState }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EduContentTocEffects])
      ],
      providers: [
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: { getTocsForBookId: () => {} }
        },
        EduContentTocEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(EduContentTocEffects);
  });

  describe('loadEduContentTocsForBook$', () => {
    const bookId = 1;
    const loadTocsForBookAction = new LoadEduContentTocsForBook({ bookId });
    const addTocsForBookAction = new AddEduContentTocsForBook({
      bookId,
      eduContentTocs: []
    });
    const loadErrorAction = new EduContentTocsLoadError(new Error('failed'));

    beforeEach(() => {
      mockServiceMethodReturnValue('getTocsForBookId', []);
    });

    describe('the book has not been loaded', () => {
      describe('api call succeeds', () => {
        it('should trigger an api call and return an action', () => {
          expectInAndOut(
            effects.loadEduContentTocsForBook$,
            loadTocsForBookAction,
            addTocsForBookAction
          );
        });
      });

      describe('api call fails', () => {
        beforeEach(() => {
          mockServiceMethodError('getTocsForBookId', 'failed');
        });

        it('should trigger an api call and return an error action', () => {
          expectInAndOut(
            effects.loadEduContentTocsForBook$,
            loadTocsForBookAction,
            loadErrorAction
          );
        });
      });
    });

    describe('the book has already been loaded', () => {
      beforeAll(() => {
        usedState = {
          ...EduContentTocReducer.initialState,
          loadedBooks: [bookId]
        };
      });

      describe('api call succeeds', () => {
        it('should not trigger an api call and return nothing', () => {
          expectInNoOut(
            effects.loadEduContentTocsForBook$,
            loadTocsForBookAction
          );
        });
      });

      describe('api call fails', () => {
        beforeEach(() => {
          mockServiceMethodError('getTocsForBookId', 'failed');
        });

        it('should not trigger an api call and return nothing', () => {
          expectInNoOut(
            effects.loadEduContentTocsForBook$,
            loadTocsForBookAction
          );
        });
      });
    });
  });

  describe('addLoadedBook$', () => {
    const bookId = 1;
    const addTocsForBookAction = new AddEduContentTocsForBook({
      bookId,
      eduContentTocs: []
    });
    const addLoadedBookAction = new AddLoadedBook({ bookId });

    const loadErrorAction = new EduContentTocsLoadError(new Error('failed'));

    it('should add the book to the loadedBooks when the tocs are added to the state', () => {
      expectInAndOut(
        effects.addLoadedBook$,
        addTocsForBookAction,
        addLoadedBookAction
      );
    });
  });
});
