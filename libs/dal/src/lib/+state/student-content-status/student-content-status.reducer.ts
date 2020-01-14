import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { StudentContentStatusInterface } from '../../+models';
import {
  StudentContentStatusesActions,
  StudentContentStatusesActionTypes
} from './student-content-status.actions';

export const NAME = 'studentContentStatuses';

export interface State extends EntityState<StudentContentStatusInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<StudentContentStatusInterface> = createEntityAdapter<
  StudentContentStatusInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: StudentContentStatusesActions
): State {
  switch (action.type) {
    case StudentContentStatusesActionTypes.StudentContentStatusAdded: {
      return adapter.addOne(action.payload.studentContentStatus, state);
    }

    case StudentContentStatusesActionTypes.StudentContentStatusUpdated: {
      return adapter.updateOne(action.payload.studentContentStatus, state);
    }

    case StudentContentStatusesActionTypes.StudentContentStatusUpserted: {
      return adapter.upsertOne(action.payload.studentContentStatus, state);
    }

    case StudentContentStatusesActionTypes.AddStudentContentStatuses: {
      return adapter.addMany(action.payload.studentContentStatuses, state);
    }

    case StudentContentStatusesActionTypes.UpsertStudentContentStatuses: {
      return adapter.upsertMany(action.payload.studentContentStatuses, state);
    }

    case StudentContentStatusesActionTypes.UpdateStudentContentStatuses: {
      return adapter.updateMany(action.payload.studentContentStatuses, state);
    }

    case StudentContentStatusesActionTypes.DeleteStudentContentStatus: {
      return adapter.removeOne(action.payload.id, state);
    }

    case StudentContentStatusesActionTypes.DeleteStudentContentStatuses: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case StudentContentStatusesActionTypes.StudentContentStatusesLoaded: {
      return adapter.addAll(action.payload.studentContentStatuses, {
        ...state,
        loaded: true
      });
    }

    case StudentContentStatusesActionTypes.StudentContentStatusesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case StudentContentStatusesActionTypes.ClearStudentContentStatuses: {
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
