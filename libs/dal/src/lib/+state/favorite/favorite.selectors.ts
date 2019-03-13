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

export const getByType = createSelector(
  selectFavoriteState,
  (state: State, props: { type: FavoriteTypesEnum }) =>
    Object.entries(state.entities)
      .filter(([key, value]) => value.type === props.type)
      .map(([key, value]) => state.entities[key])
);

export const getByTypeAndId = createSelector(
  selectFavoriteState,
  (state: State, props: { type: FavoriteTypesEnum; id: number }) => {
    let idProperty = '';
    switch (props.type) {
      case FavoriteTypesEnum.AREA:
        idProperty = 'learningAreaId';
        break;
      case FavoriteTypesEnum.BOEKE:
      case FavoriteTypesEnum.EDUCONTENT:
        idProperty = 'eduContentId';
        break;
      case FavoriteTypesEnum.BUNDLE:
        idProperty = 'bundleId';
        break;
      case FavoriteTypesEnum.TASK:
        idProperty = 'taskId';
        break;
      default:
        break;
    }

    const favorite = Object.entries(state.entities).find(([key, value]) => {
      return value.type === props.type && value[idProperty] === props.id;
    });
    return favorite ? favorite.pop() : favorite;
  }
);
