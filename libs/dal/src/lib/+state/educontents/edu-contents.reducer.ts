import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentInterface } from '../../+models';
import {
  EduContentsActions,
  EduContentsActionTypes
} from './edu-contents.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<EduContentInterface> {
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
export const adapter: EntityAdapter<EduContentInterface> = createEntityAdapter<
  EduContentInterface
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
  action: EduContentsActions
): State {
  switch (action.type) {
    case EduContentsActionTypes.AddEduContent: {
      /**
       * The addOne function provided by the created adapter
       * adds one record to the entity dictionary
       * and returns a new state including that records if it doesn't
       * exist already. If the collection is to be sorted, the adapter will
       * insert the new record into the sorted array.
       */
      return adapter.addOne(action.payload.eduContent, state);
    }

    case EduContentsActionTypes.UpsertEduContent: {
      return adapter.upsertOne(action.payload.eduContent, state);
    }

    case EduContentsActionTypes.AddEduContents: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */
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

    case EduContentsActionTypes.EduContentsLoaded: {
      return adapter.addAll(action.payload.eduContents, {
        ...state,
        loaded: true
      });
    }

    case EduContentsActionTypes.EduContentsLoadError: {
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
