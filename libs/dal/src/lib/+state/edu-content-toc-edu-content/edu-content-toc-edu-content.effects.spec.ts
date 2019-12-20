import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { EduContentTocEduContentReducer } from '.';
import { TOC_SERVICE_TOKEN } from '../../toc/toc.service.interface';
import {
  AddEduContentTocEduContentsForBook,
  AddLoadedBookForEduContentTocEduContent,
  EduContentTocEduContentsLoadError,
  LoadEduContentTocEduContentsForBook
} from './edu-content-toc-edu-content.actions';
import { EduContentTocEduContentEffects } from './edu-content-toc-edu-content.effects';

describe('EduContentTocEduContentEffects', () => {
  let actions: Observable<any>;
  let effects: EduContentTocEduContentEffects;
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
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          EduContentTocEduContentReducer.NAME,
          EduContentTocEduContentReducer.reducer,
          { initialState: usedState }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EduContentTocEduContentEffects])
      ],
      providers: [
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: { getEduContentTocEduContentForBookId: () => {} }
        },
        EduContentTocEduContentEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(EduContentTocEduContentEffects);
  });

  describe('loadEduContentTocEduContent$', () => {
    const bookId = 1;
    const loadEduContentTocEduContentsForBookAction = new LoadEduContentTocEduContentsForBook(
      { bookId }
    );
    const addEduContentTocEduContentsForBookAction = new AddEduContentTocEduContentsForBook(
      { bookId, eduContentTocEduContents: [] }
    );
    const loadErrorAction = new EduContentTocEduContentsLoadError(
      new Error('failed')
    );

    beforeEach(() => {
      mockServiceMethodReturnValue('getEduContentTocEduContentForBookId', []);
    });

    describe('the book has not been loaded', () => {
      describe('api call succeeds', () => {
        it('should trigger an api call and return an action', () => {
          expectInAndOut(
            effects.loadEduContentTocEduContents$,
            loadEduContentTocEduContentsForBookAction,
            addEduContentTocEduContentsForBookAction
          );
        });
      });

      describe('api call fails', () => {
        beforeEach(() => {
          mockServiceMethodError(
            'getEduContentTocEduContentForBookId',
            'failed'
          );
        });

        it('should trigger an api call and return an error action', () => {
          expectInAndOut(
            effects.loadEduContentTocEduContents$,
            loadEduContentTocEduContentsForBookAction,
            loadErrorAction
          );
        });
      });
    });

    describe('the book has already been loaded', () => {
      beforeAll(() => {
        usedState = {
          ...EduContentTocEduContentReducer.initialState,
          loadedBooks: [bookId]
        };
      });

      describe('api call succeeds', () => {
        it('should not trigger an api call and return nothing', () => {
          expectInNoOut(
            effects.loadEduContentTocEduContents$,
            loadEduContentTocEduContentsForBookAction
          );
        });
      });
      describe('api call fails', () => {
        beforeEach(() => {
          mockServiceMethodError(
            'getEduContentTocEduContentForBookId',
            'failed'
          );
        });
        it('should not trigger an api call and return nothing', () => {
          expectInNoOut(
            effects.loadEduContentTocEduContents$,
            loadEduContentTocEduContentsForBookAction
          );
        });
      });
    });
  });

  describe('addLoadedBook$', () => {
    const bookId = 1;
    const addEduContentTocEduContentsForBookAction = new AddEduContentTocEduContentsForBook(
      {
        bookId,
        eduContentTocEduContents: []
      }
    );

    const addLoadedBookAction = new AddLoadedBookForEduContentTocEduContent({
      bookId
    });

    it('should add the book to the loadedBooks when the eduContentTocEduContents are added to the state', () => {
      expectInAndOut(
        effects.addLoadedBook$,
        addEduContentTocEduContentsForBookAction,
        addLoadedBookAction
      );
    });
  });
});
