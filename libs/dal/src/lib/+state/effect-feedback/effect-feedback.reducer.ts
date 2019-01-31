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
  // sort by priority
  if (a.priority > b.priority) {
    return 1;
  } else if (a.priority < b.priority) {
    return -1;
  }

  // then by timestamp
  if (a.timeStamp < b.timeStamp) {
    return -1;
  } else if (a.timeStamp > b.timeStamp) {
    return 1;
  } else {
    // nothing to split them
    return 0;
  }
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
