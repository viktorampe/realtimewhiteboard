import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduNetInterface } from '../../+models';
import {
  EduNetsActions,
  EduNetsActionTypes
} from './edu-net.actions';

export const NAME = 'eduNets';

export interface State extends EntityState<EduNetInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<EduNetInterface> = createEntityAdapter<
  EduNetInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: EduNetsActions
): State {
  switch (action.type) {
    case EduNetsActionTypes.AddEduNet: {
      return adapter.addOne(action.payload.eduNet, state);
    }

    case EduNetsActionTypes.UpsertEduNet: {
      return adapter.upsertOne(action.payload.eduNet, state);
    }

    case EduNetsActionTypes.AddEduNets: {
      return adapter.addMany(action.payload.eduNets, state);
    }

    case EduNetsActionTypes.UpsertEduNets: {
      return adapter.upsertMany(action.payload.eduNets, state);
    }

    case EduNetsActionTypes.UpdateEduNet: {
      return adapter.updateOne(action.payload.eduNet, state);
    }

    case EduNetsActionTypes.UpdateEduNets: {
      return adapter.updateMany(action.payload.eduNets, state);
    }

    case EduNetsActionTypes.DeleteEduNet: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EduNetsActionTypes.DeleteEduNets: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EduNetsActionTypes.EduNetsLoaded: {
      return adapter.addAll(action.payload.eduNets, { ...state, loaded: true });
    }

    case EduNetsActionTypes.EduNetsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case EduNetsActionTypes.ClearEduNets: {
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
