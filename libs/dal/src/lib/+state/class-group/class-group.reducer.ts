import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ClassGroupInterface } from '../../+models';
import {
  ClassGroupsActions,
  ClassGroupsActionTypes
} from './class-group.actions';

export const NAME = 'classGroups';

export interface State extends EntityState<ClassGroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<ClassGroupInterface> = createEntityAdapter<
  ClassGroupInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: ClassGroupsActions
): State {
  switch (action.type) {
    case ClassGroupsActionTypes.AddClassGroup: {
      return adapter.addOne(action.payload.classGroup, state);
    }

    case ClassGroupsActionTypes.UpsertClassGroup: {
      return adapter.upsertOne(action.payload.classGroup, state);
    }

    case ClassGroupsActionTypes.AddClassGroups: {
      return adapter.addMany(action.payload.classGroups, state);
    }

    case ClassGroupsActionTypes.UpsertClassGroups: {
      return adapter.upsertMany(action.payload.classGroups, state);
    }

    case ClassGroupsActionTypes.UpdateClassGroup: {
      return adapter.updateOne(action.payload.classGroup, state);
    }

    case ClassGroupsActionTypes.UpdateClassGroups: {
      return adapter.updateMany(action.payload.classGroups, state);
    }

    case ClassGroupsActionTypes.DeleteClassGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ClassGroupsActionTypes.DeleteClassGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ClassGroupsActionTypes.ClassGroupsLoaded: {
      return adapter.addAll(action.payload.classGroups, {
        ...state,
        loaded: true
      });
    }

    case ClassGroupsActionTypes.ClassGroupsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case ClassGroupsActionTypes.ClearClassGroups: {
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
