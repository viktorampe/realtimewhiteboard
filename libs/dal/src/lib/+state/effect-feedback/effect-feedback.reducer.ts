import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  EffectFeedbackActions,
  EffectFeedbackActionTypes
} from './effect-feedback.actions';
import { EffectFeedbackInterface } from './effect-feedback.model';

export const NAME = 'effectFeedback';

export function sortByPriority(
  a: EffectFeedbackInterface,
  b: EffectFeedbackInterface
): number {
  return b.priority - a.priority;
}
export interface State extends EntityState<EffectFeedbackInterface> {
  // additional entities state properties
}

export const adapter: EntityAdapter<
  EffectFeedbackInterface
> = createEntityAdapter<EffectFeedbackInterface>({
  sortComparer: sortByPriority
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: EffectFeedbackActions
): State {
  switch (action.type) {
    case EffectFeedbackActionTypes.AddEffectFeedback: {
      return adapter.addOne(action.payload.effectFeedback, state);
    }

    case EffectFeedbackActionTypes.UpsertEffectFeedback: {
      return adapter.upsertOne(action.payload.effectFeedback, state);
    }

    case EffectFeedbackActionTypes.AddEffectFeedbacks: {
      return adapter.addMany(action.payload.effectFeedbacks, state);
    }

    case EffectFeedbackActionTypes.UpsertEffectFeedbacks: {
      return adapter.upsertMany(action.payload.effectFeedbacks, state);
    }

    case EffectFeedbackActionTypes.UpdateEffectFeedback: {
      return adapter.updateOne(action.payload.effectFeedback, state);
    }

    case EffectFeedbackActionTypes.UpdateEffectFeedbacks: {
      return adapter.updateMany(action.payload.effectFeedbacks, state);
    }

    case EffectFeedbackActionTypes.DeleteEffectFeedback: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EffectFeedbackActionTypes.DeleteEffectFeedbacks: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EffectFeedbackActionTypes.LoadEffectFeedbacks: {
      return adapter.addAll(action.payload.effectFeedbacks, state);
    }

    case EffectFeedbackActionTypes.ClearEffectFeedbacks: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
