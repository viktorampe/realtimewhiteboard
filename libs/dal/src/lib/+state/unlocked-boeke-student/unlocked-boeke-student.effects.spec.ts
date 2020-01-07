import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { UnlockedBoekeStudentReducer } from '.';
import { UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN } from '../../boeke/unlocked-boeke-student.service.interface';
import {
  LoadUnlockedBoekeStudents,
  UnlockedBoekeStudentsLoaded,
  UnlockedBoekeStudentsLoadError
} from './unlocked-boeke-student.actions';
import { UnlockedBoekeStudentsEffects } from './unlocked-boeke-student.effects';

describe('UnlockedBoekeStudentEffects', () => {
  let actions: Observable<any>;
  let effects: UnlockedBoekeStudentsEffects;
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
    service: any = UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        StoreModule.forFeature(
          UnlockedBoekeStudentReducer.NAME,
          UnlockedBoekeStudentReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UnlockedBoekeStudentsEffects])
      ],
      providers: [
        {
          provide: UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        UnlockedBoekeStudentsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(UnlockedBoekeStudentsEffects);
  });

  describe('loadUnlockedBoekeStudent$', () => {
    const unforcedLoadAction = new LoadUnlockedBoekeStudents({ userId: 1 });
    const forcedLoadAction = new LoadUnlockedBoekeStudents({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new UnlockedBoekeStudentsLoaded({
      unlockedBoekeStudents: []
    });
    const loadErrorAction = new UnlockedBoekeStudentsLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = UnlockedBoekeStudentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedBoekeStudentReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadUnlockedBoekeStudents$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = UnlockedBoekeStudentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedBoekeStudentReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUnlockedBoekeStudents$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeStudents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
