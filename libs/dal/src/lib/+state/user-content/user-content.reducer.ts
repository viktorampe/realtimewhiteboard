import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserContentInterface } from '../../+models';
import {
  UserContentsActions,
  UserContentsActionTypes
} from './user-content.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<UserContentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<UserContentInterface> = createEntityAdapter<
  UserContentInterface
>();

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: UserContentsActions
): State {
  switch (action.type) {
    case UserContentsActionTypes.AddUserContent: {
      /**
       * The addOne function provided by the created adapter
       * adds one record to the entity dictionary
       * and returns a new state including that records if it doesn't
       * exist already. If the collection is to be sorted, the adapter will
       * insert the new record into the sorted array.
       */
      return adapter.addOne(action.payload.userContent, state);
    }

    case UserContentsActionTypes.UpsertUserContent: {
      return adapter.upsertOne(action.payload.userContent, state);
    }

    case UserContentsActionTypes.AddUserContents: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */
      return adapter.addMany(action.payload.userContents, state);
    }

    case UserContentsActionTypes.UpsertUserContents: {
      return adapter.upsertMany(action.payload.userContents, state);
    }

    case UserContentsActionTypes.UpdateUserContent: {
      return adapter.updateOne(action.payload.userContent, state);
    }

    case UserContentsActionTypes.UpdateUserContents: {
      return adapter.updateMany(action.payload.userContents, state);
    }

    case UserContentsActionTypes.DeleteUserContent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UserContentsActionTypes.DeleteUserContents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UserContentsActionTypes.UserContentsLoaded: {
      return adapter.addAll(action.payload.userContents, {
        ...state,
        loaded: true
      });
    }

    case UserContentsActionTypes.UserContentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UserContentsActionTypes.ClearUserContents: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
