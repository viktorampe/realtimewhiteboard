import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentTOCInterface } from '../../+models';
import {
  EduContentTocsActions,
  EduContentTocsActionTypes
} from './edu-content-toc.actions';

export const NAME = 'eduContentTocs';

export interface State extends EntityState<EduContentTOCInterface> {
  // additional entities state properties
  error?: any;
  loadedBooks: number[];
}

export const adapter: EntityAdapter<
  EduContentTOCInterface
> = createEntityAdapter<EduContentTOCInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loadedBooks: []
});

export function reducer(
  state = initialState,
  action: EduContentTocsActions
): State {
  switch (action.type) {
    case EduContentTocsActionTypes.AddEduContentToc: {
      return adapter.addOne(action.payload.eduContentToc, state);
    }

    case EduContentTocsActionTypes.UpsertEduContentToc: {
      return adapter.upsertOne(action.payload.eduContentToc, state);
    }

    case EduContentTocsActionTypes.AddEduContentTocsForBook: {
      return adapter.addMany(action.payload.eduContentTocs, state);
    }

    case EduContentTocsActionTypes.AddLoadedBook: {
      return {
        ...state,
        loadedBooks: [...state.loadedBooks, action.payload.bookId]
      };
    }

    case EduContentTocsActionTypes.UpsertEduContentTocs: {
      return adapter.upsertMany(action.payload.eduContentTocs, state);
    }

    case EduContentTocsActionTypes.UpdateEduContentToc: {
      return adapter.updateOne(action.payload.eduContentToc, state);
    }

    case EduContentTocsActionTypes.UpdateEduContentTocs: {
      return adapter.updateMany(action.payload.eduContentTocs, state);
    }

    case EduContentTocsActionTypes.DeleteEduContentToc: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EduContentTocsActionTypes.DeleteEduContentTocs: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EduContentTocsActionTypes.EduContentTocsLoadError: {
      return {
        ...state,
        loadedBooks: [],
        error: action.payload
      };
    }

    case EduContentTocsActionTypes.ClearEduContentTocs: {
      return adapter.removeAll(state);
    }

    case EduContentTocsActionTypes.ClearLoadedBooks: {
      return { ...state, loadedBooks: [] };
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
