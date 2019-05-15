import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteTypesEnum } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './favorite.reducer';

export const selectFavoriteState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectFavoriteState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectFavoriteState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectFavoriteState,
  selectAll
);

export const getCount = createSelector(
  selectFavoriteState,
  selectTotal
);

export const getIds = createSelector(
  selectFavoriteState,
  selectIds
);

export const getAllEntities = createSelector(
  selectFavoriteState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * favorite$: FavoriteInterface[] = this.store.pipe(
    select(FavoriteQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectFavoriteState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * favorite$: FavoriteInterface = this.store.pipe(
    select(FavoriteQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectFavoriteState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

// TODO: Investigate why this causes an infinite loop when used for SideNav
export const getByType = createSelector(
  selectFavoriteState,
  (state: State, props: { type: FavoriteTypesEnum }) =>
    Object.values(state.entities).filter(value => value.type === props.type)
);

export const getFavoriteEduContents = createSelector(
  selectFavoriteState,
  (state: State) => {
    const byEduContentId: State = {
      ids: [],
      entities: {},
      loaded: true
    };
    Object.values(state.entities).forEach(value => {
      if (value.eduContentId) {
        byEduContentId.entities[value.eduContentId] = value;
      }
    });
    return byEduContentId;
  }
);

export const getByTypeAndId = createSelector(
  selectFavoriteState,
  (state: State, props: { type: FavoriteTypesEnum; id: number }) => {
    const idProperty = getIdProperty(props.type);

    return Object.values(state.entities).find(value => {
      return value.type === props.type && value[idProperty] === props.id;
    });
  }
);

export const getIsFavoriteEduContent = createSelector(
  getFavoriteEduContents,
  (state: State, props: { eduContentId: number }) => {
    return !!state.entities[props.eduContentId];
  }
);

function getIdProperty(type: FavoriteTypesEnum): string {
  switch (type) {
    case FavoriteTypesEnum.AREA:
      return 'learningAreaId';
    case FavoriteTypesEnum.BOEKE:
    case FavoriteTypesEnum.EDUCONTENT:
      return 'eduContentId';
    case FavoriteTypesEnum.BUNDLE:
      return 'bundleId';
    case FavoriteTypesEnum.TASK:
      return 'taskId';
    case FavoriteTypesEnum.SEARCH:
      return 'criteria';
    default:
      return;
  }
}
