import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { LearningDomainReducer } from '.';
import { LEARNING_DOMAIN_SERVICE_TOKEN } from '../../metadata/learning-domain.service.interface';
import {
  LearningDomainsLoaded,
  LearningDomainsLoadError,
  LoadLearningDomains
} from './learning-domain.actions';
import { LearningDomainEffects } from './learning-domain.effects';

describe('LearningDomainEffects', () => {
  let actions: Observable<any>;
  let effects: LearningDomainEffects;
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
    service: any = LEARNING_DOMAIN_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = LEARNING_DOMAIN_SERVICE_TOKEN
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
          LearningDomainReducer.NAME,
          LearningDomainReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([LearningDomainEffects])
      ],
      providers: [
        {
          provide: LEARNING_DOMAIN_SERVICE_TOKEN,
          useValue: {
            getAll: () => {}
          }
        },
        LearningDomainEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(LearningDomainEffects);
  });

  describe('loadLearningDomain$', () => {
    const unforcedLoadAction = new LoadLearningDomains({ userId: 1 });
    const forcedLoadAction = new LoadLearningDomains({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new LearningDomainsLoaded({
      learningDomains: []
    });
    const loadErrorAction = new LearningDomainsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = LearningDomainReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...LearningDomainReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadLearningDomains$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = LearningDomainReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...LearningDomainReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadLearningDomains$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadLearningDomains$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
