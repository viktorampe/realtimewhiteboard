import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningDomainInterface } from '../../+models';
import {
  LearningDomainsActions,
  LearningDomainsActionTypes
} from './learning-domain.actions';

export const NAME = 'learningDomains';

export interface State extends EntityState<LearningDomainInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<LearningDomainInterface> = createEntityAdapter<
  LearningDomainInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: LearningDomainsActions
): State {
  switch (action.type) {
    case LearningDomainsActionTypes.AddLearningDomain: {
      return adapter.addOne(action.payload.learningDomain, state);
    }

    case LearningDomainsActionTypes.UpsertLearningDomain: {
      return adapter.upsertOne(action.payload.learningDomain, state);
    }

    case LearningDomainsActionTypes.AddLearningDomains: {
      return adapter.addMany(action.payload.learningDomains, state);
    }

    case LearningDomainsActionTypes.UpsertLearningDomains: {
      return adapter.upsertMany(action.payload.learningDomains, state);
    }

    case LearningDomainsActionTypes.UpdateLearningDomain: {
      return adapter.updateOne(action.payload.learningDomain, state);
    }

    case LearningDomainsActionTypes.UpdateLearningDomains: {
      return adapter.updateMany(action.payload.learningDomains, state);
    }

    case LearningDomainsActionTypes.DeleteLearningDomain: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LearningDomainsActionTypes.DeleteLearningDomains: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LearningDomainsActionTypes.LearningDomainsLoaded: {
      return adapter.addAll(action.payload.learningDomains, {
        ...state,
        loaded: true
      });
    }

    case LearningDomainsActionTypes.LearningDomainsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LearningDomainsActionTypes.ClearLearningDomains: {
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
