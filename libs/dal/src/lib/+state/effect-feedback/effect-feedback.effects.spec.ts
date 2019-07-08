import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { EffectFeedbackActions, EffectFeedbackReducer } from '.';
import { EffectFeedbackEffects } from './effect-feedback.effects';
import { EffectFeedback } from './effect-feedback.model';

describe('EffectFeedbackEffects', () => {
  let actions: Observable<any>;
  let effects: EffectFeedbackEffects;

  const successFeedback = new EffectFeedbackActions.AddEffectFeedback({
    effectFeedback: new EffectFeedback({
      id: 'foo bar',
      message: 'some message',
      triggerAction: { type: 'feedbackTriggeringAction', payload: {} }
    })
  });
  const errorFeedback = new EffectFeedbackActions.AddEffectFeedback({
    effectFeedback: new EffectFeedback({
      id: 'bar foo',
      message: 'some message',
      triggerAction: { type: 'feedbackTriggeringAction', payload: {} },
      type: 'error'
    })
  });
  const successFeedbackWithoutHandler = new EffectFeedbackActions.AddEffectFeedback(
    {
      effectFeedback: new EffectFeedback({
        id: 'foo',
        message: 'some message',
        triggerAction: {
          type: 'feedbackTriggeringAction',
          payload: {
            customFeedbackHandlers: {
              useCustomSuccessHandler: 'useNoHandler'
            }
          }
        }
      })
    }
  );
  const errorFeedbackWithoutHandler = new EffectFeedbackActions.AddEffectFeedback(
    {
      effectFeedback: new EffectFeedback({
        id: 'bar',
        message: 'some message',
        triggerAction: {
          type: 'feedbackTriggeringAction',
          payload: {
            customFeedbackHandlers: {
              useCustomErrorHandler: 'useNoHandler'
            }
          }
        },
        type: 'error'
      })
    }
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          EffectFeedbackReducer.NAME,
          EffectFeedbackReducer.reducer,
          {
            initialState: {}
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([EffectFeedbackEffects])
      ],
      providers: [provideMockActions(() => actions)]
    });

    effects = TestBed.get(EffectFeedbackEffects);
    actions = hot('-a-b-c-d-|', {
      a: successFeedback,
      b: errorFeedback,
      c: successFeedbackWithoutHandler,
      d: errorFeedbackWithoutHandler
    });
  });

  it('should trigger deleteAction for successFeedback only if useNoHandler is passed ', () => {
    const deleteSuccesFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback(
      { id: 'foo' }
    );
    expect(effects.addNewSuccessEffectFeedback$).toBeObservable(
      hot('-----a---|', {
        a: deleteSuccesFeedbackAction
      })
    );
  });
  it('should trigger deleteAction for errorFeedback only if useNoHandler is passed ', () => {
    const deleteErrorFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback(
      { id: 'bar' }
    );
    expect(effects.addNewErrorEffectFeedback$).toBeObservable(
      hot('-------a-|', {
        a: deleteErrorFeedbackAction
      })
    );
  });
});
