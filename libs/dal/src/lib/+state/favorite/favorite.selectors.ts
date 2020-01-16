import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteInterface, FavoriteTypesEnum } from '../../+models';
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

export const getAll = createSelector(selectFavoriteState, selectAll);

export const getCount = createSelector(selectFavoriteState, selectTotal);

export const getIds = createSelector(selectFavoriteState, selectIds);

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
export const getByType = (type: FavoriteTypesEnum) =>
  createSelector(selectFavoriteState, (state: State) =>
    Object.values(state.entities).filter(value => value.type === type)
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
  selectFavoriteState,
  (state: State, props: { eduContentId: number }) => {
    return (state.ids as number[]).some(
      id => state.entities[id].eduContentId === props.eduContentId
    );
  }
);

/**
 * returns an object with favorites grouped by type, ordered by date descending
 * @example
 * favorites$: FavoriteInterface = this.store.pipe(
  select(HistoryQueries.favoritesByType)
);
*/
export const favoritesByType = createSelector(
  selectFavoriteState,
  (state: State) => {
    const byKey: { [key: string]: FavoriteInterface[] } = {};
    // must cast state.ids to number[] (from 'string[] | number[]') or we can't use array functions like forEach
    (state.ids as number[]).forEach((id: number) => {
      const item = state.entities[id];
      if (!byKey[item.type]) {
        byKey[item.type] = [];
      }
      byKey[item.type].push(item);
    });

    Object.keys(byKey).forEach(key =>
      byKey[key].sort((a, b) => (a.created < b.created ? 1 : -1))
    );

    return byKey;
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
