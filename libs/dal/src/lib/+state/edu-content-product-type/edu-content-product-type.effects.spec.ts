import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { EduContentProductTypeReducer } from '.';
import { EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN } from '../../metadata/edu-content-product-type.service.interface';
import { EduContentProductTypesLoaded, EduContentProductTypesLoadError, LoadEduContentProductTypes } from './edu-content-product-type.actions';
import { EduContentProductTypeEffects } from './edu-content-product-type.effects';

describe('EduContentProductTypeEffects', () => {
  let actions: Observable<any>;
  let effects: EduContentProductTypeEffects;
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
    service: any = EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN
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
          EduContentProductTypeReducer.NAME,
          EduContentProductTypeReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EduContentProductTypeEffects])
      ],
      providers: [
        {
          provide: EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
          useValue: {
            getAll: () => {}
          }
        },
        EduContentProductTypeEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(EduContentProductTypeEffects);
  });

  describe('loadEduContentProductType$', () => {
    const unforcedLoadAction = new LoadEduContentProductTypes({ userId: 1 });
    const forcedLoadAction = new LoadEduContentProductTypes({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new EduContentProductTypesLoaded({
      eduContentProductTypes: []
    });
    const loadErrorAction = new EduContentProductTypesLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = EduContentProductTypeReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...EduContentProductTypeReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadEduContentProductTypes$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = EduContentProductTypeReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...EduContentProductTypeReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadEduContentProductTypes$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadEduContentProductTypes$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
