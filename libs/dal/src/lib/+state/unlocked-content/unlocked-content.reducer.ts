import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UnlockedContentInterface } from '../../+models';
import {
  UnlockedContentsActions,
  UnlockedContentsActionTypes
} from './unlocked-content.actions';

export const NAME = 'unlockedContents';

const sortByIndex = (
  a: UnlockedContentInterface,
  b: UnlockedContentInterface
) => a.index - b.index || a.id - b.id; // if index is equal, sort by id asc

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<UnlockedContentInterface> {
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
export const adapter: EntityAdapter<UnlockedContentInterface> = createEntityAdapter<
  UnlockedContentInterface
>({
  sortComparer: sortByIndex
});

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
  action: UnlockedContentsActions
): State {
  switch (action.type) {
    case UnlockedContentsActionTypes.AddUnlockedContent: {
      /**
       * The addOne function provided by the created adapter
       * adds one record to the entity dictionary
       * and returns a new state including that records if it doesn't
       * exist already. If the collection is to be sorted, the adapter will
       * insert the new record into the sorted array.
       */
      return adapter.addOne(action.payload.unlockedContent, state);
    }

    case UnlockedContentsActionTypes.UpsertUnlockedContent: {
      return adapter.upsertOne(action.payload.unlockedContent, state);
    }

    case UnlockedContentsActionTypes.AddUnlockedContents: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */
      return adapter.addMany(action.payload.unlockedContents, state);
    }

    case UnlockedContentsActionTypes.UpsertUnlockedContents: {
      return adapter.upsertMany(action.payload.unlockedContents, state);
    }

    case UnlockedContentsActionTypes.UpdateUnlockedContent: {
      return adapter.updateOne(action.payload.unlockedContent, state);
    }

    case UnlockedContentsActionTypes.UpdateUnlockedContents: {
      return adapter.updateMany(action.payload.unlockedContents, state);
    }

    case UnlockedContentsActionTypes.DeleteUnlockedContent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UnlockedContentsActionTypes.DeleteUnlockedContents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UnlockedContentsActionTypes.UnlockedContentsLoaded: {
      return adapter.addAll(action.payload.unlockedContents, {
        ...state,
        loaded: true
      });
    }

    case UnlockedContentsActionTypes.UnlockedContentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UnlockedContentsActionTypes.ClearUnlockedContents: {
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
