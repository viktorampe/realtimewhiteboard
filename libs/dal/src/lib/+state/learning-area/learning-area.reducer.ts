import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningAreaInterface } from '../../+models';
import {
  LearningAreasActions,
  LearningAreasActionTypes
} from './learning-area.actions';

export const NAME = 'learningAreas';
/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<LearningAreaInterface> {
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
export const adapter: EntityAdapter<LearningAreaInterface> = createEntityAdapter<
  LearningAreaInterface
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
  action: LearningAreasActions
): State {
  switch (action.type) {
    case LearningAreasActionTypes.AddLearningArea: {
      /**
       * The addOne function provided by the created adapter
       * adds one record to the entity dictionary
       * and returns a new state including that records if it doesn't
       * exist already. If the collection is to be sorted, the adapter will
       * insert the new record into the sorted array.
       */
      return adapter.addOne(action.payload.learningArea, state);
    }

    case LearningAreasActionTypes.UpsertLearningArea: {
      return adapter.upsertOne(action.payload.learningArea, state);
    }

    case LearningAreasActionTypes.AddLearningAreas: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */
      return adapter.addMany(action.payload.learningAreas, state);
    }

    case LearningAreasActionTypes.UpsertLearningAreas: {
      return adapter.upsertMany(action.payload.learningAreas, state);
    }

    case LearningAreasActionTypes.UpdateLearningArea: {
      return adapter.updateOne(action.payload.learningArea, state);
    }

    case LearningAreasActionTypes.UpdateLearningAreas: {
      return adapter.updateMany(action.payload.learningAreas, state);
    }

    case LearningAreasActionTypes.DeleteLearningArea: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LearningAreasActionTypes.DeleteLearningAreas: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LearningAreasActionTypes.LearningAreasLoaded: {
      return adapter.addAll(action.payload.learningAreas, {
        ...state,
        loaded: true
      });
    }

    case LearningAreasActionTypes.LearningAreasLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LearningAreasActionTypes.ClearLearningAreas: {
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
