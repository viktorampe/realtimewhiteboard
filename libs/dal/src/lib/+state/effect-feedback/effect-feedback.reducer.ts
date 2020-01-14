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
  return (
    // sort by priority -> descending
    b.priority - a.priority ||
    // then by timestamp -> ascending
    a.timeStamp - b.timeStamp
  );
}
export interface State extends EntityState<EffectFeedbackInterface> {
  // additional entities state properties
}

export const adapter: EntityAdapter<EffectFeedbackInterface> = createEntityAdapter<
  EffectFeedbackInterface
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
