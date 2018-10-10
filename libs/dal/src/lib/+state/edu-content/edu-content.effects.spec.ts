import { TestBed } from '@angular/core/testing';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EduContentInterface } from '../../+models/EduContent.interface';
import { EduContentService } from '../../educontent/edu-content.service';
import { EDUCONTENT_SERVICE_TOKEN } from '../../educontent/edu-content.service.interface';
import {
  EduContentsLoaded,
  EduContentsLoadError,
  LoadEduContents
} from './edu-content.actions';
import { EduContentsEffects } from './edu-content.effects';
import { initialState, reducer } from './edu-content.reducer';

describe('EduContentEffects', () => {
  let actions: Observable<any>;
  let effects: EduContentsEffects;
  let usedState: any;

  const unforcedLoadAction = new LoadEduContents({});
  const forcedLoadAction = new LoadEduContents({ force: true });
  const filledLoadedAction = new EduContentsLoaded({ eduContents: [] });
  const loadErrorAction = new EduContentsLoadError(new Error('failed'));

  const expectInAndOut = (triggerAction: Action, effectOutput: any) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadEduContents$).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  const expectInNoOut = (triggerAction: Action) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadEduContents$).toBeObservable(hot('---|'));
  };

  const jestMockTokenGetEduContentsReturnValue = () => {
    jest
      .spyOn(TestBed.get(EDUCONTENT_SERVICE_TOKEN), 'getAll')
      .mockReturnValue(
        new BehaviorSubject<EduContentInterface[]>([]).pipe(take(1))
      );
  };
  const jestMockTokenGetEduContentsError = () => {
    jest
      .spyOn(TestBed.get(EDUCONTENT_SERVICE_TOKEN), 'getAll')
      .mockImplementation(() => {
        throw new Error('failed');
      });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature('eduContent', reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EduContentsEffects])
      ],
      providers: [
        {
          provide: EDUCONTENT_SERVICE_TOKEN,
          useClass: EduContentService
        },
        {
          provide: EduContentApi,
          userClass: {}
        },
        EduContentsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(EduContentsEffects);
  });

  describe('loadEduContent$ with initialState', () => {
    beforeAll(() => {
      usedState = initialState;
    });
    beforeEach(() => {
      jestMockTokenGetEduContentsReturnValue();
    });
    it('should trigger an api call with the initialState if force is not true', () => {
      expectInAndOut(unforcedLoadAction, filledLoadedAction);
    });
    it('should trigger an api call with the initialState if force is true', () => {
      expectInAndOut(forcedLoadAction, filledLoadedAction);
    });
  });
  describe('loadEduContent$ with loaded state', () => {
    beforeAll(() => {
      usedState = { ...initialState, loaded: true };
    });
    beforeEach(() => {
      jestMockTokenGetEduContentsReturnValue();
    });
    it('should not trigger an api call with the loaded state if force is not true', () => {
      expectInNoOut(unforcedLoadAction);
    });
    it('should trigger an api call with the loaded state if force is true', () => {
      expectInAndOut(forcedLoadAction, filledLoadedAction);
    });
  });

  describe('loadEduContent$ with initialState and failing api call', () => {
    beforeAll(() => {
      usedState = initialState;
    });
    beforeEach(() => {
      jestMockTokenGetEduContentsError();
    });
    it('should return a error action if force is not true', () => {
      expectInAndOut(unforcedLoadAction, loadErrorAction);
    });
    it('should return a error action if force is true', () => {
      expectInAndOut(forcedLoadAction, loadErrorAction);
    });
  });

  describe('loadEduContent$ with loaded and failing api call', () => {
    beforeAll(() => {
      usedState = {
        ...initialState,
        loaded: true,
        list: []
      };
    });
    beforeEach(() => {
      jestMockTokenGetEduContentsError();
    });
    it('should return nothing action if force is not true', () => {
      expectInNoOut(unforcedLoadAction);
    });
    it('should return a error action if force is true', () => {
      expectInAndOut(forcedLoadAction, loadErrorAction);
    });
  });
});
