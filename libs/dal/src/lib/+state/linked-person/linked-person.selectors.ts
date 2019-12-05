import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './linked-person.reducer';

export const selectLinkedPersonState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectLinkedPersonState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectLinkedPersonState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectLinkedPersonState,
  selectAll
);

export const getCount = createSelector(
  selectLinkedPersonState,
  selectTotal
);

export const getIds = createSelector(
  selectLinkedPersonState,
  selectIds
);

export const getAllEntities = createSelector(
  selectLinkedPersonState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * person$: PersonInterface[] = this.store.pipe(
    select(PersonQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectLinkedPersonState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * person$: PersonInterface = this.store.pipe(
    select(PersonQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectLinkedPersonState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getStudents = createSelector(
  selectLinkedPersonState,
  (state: State) => {
    (state.ids as number[]).reduce((students, id) => {
      const person = state.entities[id];
      if (person.type === 'student') {
        students.push(person);
      }
      return students;
    }, []);
  }
);
