import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentBookInterface } from '../../+models';
import {
  EduContentBooksActions,
  EduContentBooksActionTypes
} from './edu-content-book.actions';

export const NAME = 'eduContentBooks';

export interface State extends EntityState<EduContentBookInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<
  EduContentBookInterface
> = createEntityAdapter<EduContentBookInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: EduContentBooksActions
): State {
  switch (action.type) {
    case EduContentBooksActionTypes.EduContentBooksLoaded: {
      return adapter.addAll(action.payload.eduContentBooks, {
        ...state,
        loaded: true
      });
    }

    case EduContentBooksActionTypes.EduContentBooksLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case EduContentBooksActionTypes.ClearEduContentBooks: {
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
