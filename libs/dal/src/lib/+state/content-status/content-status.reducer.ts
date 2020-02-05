import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ContentStatusInterface } from '../../+models';
import {
  ContentStatusesActions,
  ContentStatusesActionTypes
} from './content-status.actions';

export const NAME = 'contentStatuses';

export interface State extends EntityState<ContentStatusInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<ContentStatusInterface> = createEntityAdapter<
  ContentStatusInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: ContentStatusesActions
): State {
  switch (action.type) {
    case ContentStatusesActionTypes.AddContentStatus: {
      return adapter.addOne(action.payload.contentStatus, state);
    }

    case ContentStatusesActionTypes.UpsertContentStatus: {
      return adapter.upsertOne(action.payload.contentStatus, state);
    }

    case ContentStatusesActionTypes.AddContentStatuses: {
      return adapter.addMany(action.payload.contentStatuses, state);
    }

    case ContentStatusesActionTypes.UpsertContentStatuses: {
      return adapter.upsertMany(action.payload.contentStatuses, state);
    }

    case ContentStatusesActionTypes.UpdateContentStatus: {
      return adapter.updateOne(action.payload.contentStatus, state);
    }

    case ContentStatusesActionTypes.UpdateContentStatuses: {
      return adapter.updateMany(action.payload.contentStatuses, state);
    }

    case ContentStatusesActionTypes.DeleteContentStatus: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ContentStatusesActionTypes.DeleteContentStatuses: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ContentStatusesActionTypes.ContentStatusesLoaded: {
      return adapter.addAll(action.payload.contentStatuses, {
        ...state,
        loaded: true
      });
    }

    case ContentStatusesActionTypes.ContentStatusesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case ContentStatusesActionTypes.ClearContentStatuses: {
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
