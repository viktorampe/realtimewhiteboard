import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentTOCEduContentInterface } from '../../+models';
import {
  EduContentTocEduContentsActions,
  EduContentTocEduContentsActionTypes
} from './edu-content-toc-edu-content.actions';

export const NAME = 'eduContentTocEduContents';

export interface State extends EntityState<EduContentTOCEduContentInterface> {
  // additional entities state properties
  error?: any;
  loadedBooks: number[];
}

export const adapter: EntityAdapter<
  EduContentTOCEduContentInterface
> = createEntityAdapter<EduContentTOCEduContentInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loadedBooks: []
});

export function reducer(
  state = initialState,
  action: EduContentTocEduContentsActions
): State {
  switch (action.type) {
    case EduContentTocEduContentsActionTypes.EduContentTocEduContentsLoadError: {
      return { ...state, loadedBooks: [], error: action.payload };
    }

    case EduContentTocEduContentsActionTypes.AddLoadedBook: {
      return {
        ...state,
        loadedBooks: [...state.loadedBooks, action.payload.bookId]
      };
    }

    case EduContentTocEduContentsActionTypes.AddEduContentTocEduContentsForBook: {
      return adapter.addMany(action.payload.eduContentTocEduContents, state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectAll,
  selectEntities,
  selectTotal
} = adapter.getSelectors();
