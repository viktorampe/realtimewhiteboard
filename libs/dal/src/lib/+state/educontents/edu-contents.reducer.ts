import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentInterface } from '../../+models';
import {
  EduContentsActions,
  EduContentsActionTypes
} from './edu-contents.actions';

export interface EduContentsState extends EntityState<EduContentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<EduContentInterface> = createEntityAdapter<
  EduContentInterface
>();

export const initialEducontentState: EduContentsState = adapter.getInitialState(
  {
    // additional entity state properties
    loaded: false
  }
);

export function reducer(
  state = initialEducontentState,
  action: EduContentsActions
): EduContentsState {
  switch (action.type) {
    case EduContentsActionTypes.AddEduContent: {
      return adapter.addOne(action.payload.eduContent, state);
    }

    case EduContentsActionTypes.UpsertEduContent: {
      return adapter.upsertOne(action.payload.eduContent, state);
    }

    case EduContentsActionTypes.AddEduContents: {
      return adapter.addMany(action.payload.eduContents, state);
    }

    case EduContentsActionTypes.UpsertEduContents: {
      return adapter.upsertMany(action.payload.eduContents, state);
    }

    case EduContentsActionTypes.UpdateEduContent: {
      return adapter.updateOne(action.payload.eduContent, state);
    }

    case EduContentsActionTypes.UpdateEduContents: {
      return adapter.updateMany(action.payload.eduContents, state);
    }

    case EduContentsActionTypes.DeleteEduContent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EduContentsActionTypes.DeleteEduContents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EduContentsActionTypes.EducontentsLoaded: {
      return adapter.addAll(action.payload.eduContents, state);
    }

    case EduContentsActionTypes.EducontentsLoadError: {
      return { ...state, error: action.payload };
    }

    case EduContentsActionTypes.ClearEduContents: {
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
