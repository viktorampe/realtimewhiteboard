import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GroupInterface } from '../../+models';
import {
  GroupsActions,
  GroupsActionTypes
} from './group.actions';

export const NAME = 'groups';

export interface State extends EntityState<GroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<GroupInterface> = createEntityAdapter<
  GroupInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: GroupsActions
): State {
  switch (action.type) {
    case GroupsActionTypes.AddGroup: {
      return adapter.addOne(action.payload.group, state);
    }

    case GroupsActionTypes.UpsertGroup: {
      return adapter.upsertOne(action.payload.group, state);
    }

    case GroupsActionTypes.AddGroups: {
      return adapter.addMany(action.payload.groups, state);
    }

    case GroupsActionTypes.UpsertGroups: {
      return adapter.upsertMany(action.payload.groups, state);
    }

    case GroupsActionTypes.UpdateGroup: {
      return adapter.updateOne(action.payload.group, state);
    }

    case GroupsActionTypes.UpdateGroups: {
      return adapter.updateMany(action.payload.groups, state);
    }

    case GroupsActionTypes.DeleteGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case GroupsActionTypes.DeleteGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case GroupsActionTypes.GroupsLoaded: {
      return adapter.addAll(action.payload.groups, { ...state, loaded: true });
    }

    case GroupsActionTypes.GroupsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case GroupsActionTypes.ClearGroups: {
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
