import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  EffectFeedbackActions,
  EffectFeedbackActionTypes
} from './effect-feedback.actions';
import { EffectFeedback } from './effect-feedback.model';

export const NAME = 'effectFeedback';

export function sortByPriority(a: EffectFeedback, b: EffectFeedback): number {
  return b.priority - a.priority;
}
export interface State extends EntityState<EffectFeedback> {
  // additional entities state properties
}

export const adapter: EntityAdapter<EffectFeedback> = createEntityAdapter<
  EffectFeedback
>({
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

    case EffectFeedbackActionTypes.DeleteEffectFeedback: {
      return adapter.removeOne(action.payload.id, state);
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
