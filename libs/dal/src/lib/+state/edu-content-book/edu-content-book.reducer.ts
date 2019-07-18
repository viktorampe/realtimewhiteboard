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
  diaboloEnabledLoaded: boolean;
  diaboloEnabledBookIds: number[];
  error?: any;
}

export const adapter: EntityAdapter<
  EduContentBookInterface
> = createEntityAdapter<EduContentBookInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false,
  diaboloEnabledLoaded: false,
  diaboloEnabledBookIds: []
});

export function reducer(
  state = initialState,
  action: EduContentBooksActions
): State {
  switch (action.type) {
    case EduContentBooksActionTypes.AddEduContentBook: {
      return adapter.addOne(action.payload.eduContentBook, state);
    }

    case EduContentBooksActionTypes.UpsertEduContentBook: {
      return adapter.upsertOne(action.payload.eduContentBook, state);
    }

    case EduContentBooksActionTypes.AddEduContentBooks: {
      return adapter.addMany(action.payload.eduContentBooks, state);
    }

    case EduContentBooksActionTypes.UpsertEduContentBooks: {
      return adapter.upsertMany(action.payload.eduContentBooks, state);
    }

    case EduContentBooksActionTypes.UpdateEduContentBook: {
      return adapter.updateOne(action.payload.eduContentBook, state);
    }

    case EduContentBooksActionTypes.UpdateEduContentBooks: {
      return adapter.updateMany(action.payload.eduContentBooks, state);
    }

    case EduContentBooksActionTypes.DeleteEduContentBook: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EduContentBooksActionTypes.DeleteEduContentBooks: {
      return adapter.removeMany(action.payload.ids, state);
    }

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
