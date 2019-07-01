import { Action } from '@ngrx/store';

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface AppState {}

export const initialState: AppState = {};

export function appReducer(
  state: AppState = initialState,
  action: Action
): AppState {
  switch (action.type) {
  }
  return state;
}
