import { InjectionToken, ModuleWithProviders } from '@angular/core';
import {
  Action,
  ActionReducer,
  createSelector,
  StoreModule
} from '@ngrx/store';
import { BundleInterface } from '../+models';
import { BundleQueries, BundleReducer } from './bundle';

// this is a placeholder example and can be removed when no longer needed
export const getLearningAreaBundles = createSelector(
  BundleQueries.selectBundleState,
  BundleQueries.getAll,
  (
    state: BundleReducer.State,
    bundles: BundleInterface[],
    props: { learingAreaId: number }
  ) => {
    return bundles.filter(
      bundle => bundle.learningAreaId === props.learingAreaId
    );
  }
);

export interface ReducerNamespaceInterface {
  NAME: string;
  reducer:
    | ActionReducer<any, Action>
    | InjectionToken<ActionReducer<any, Action>>;
  initialState: any;
}

export function getModuleWithForFeatureProviders<
  T extends ReducerNamespaceInterface
>(reducers: T[]): ModuleWithProviders[] {
  return reducers.map(reducer => {
    return StoreModule.forFeature(
      reducer.NAME,
      reducer.reducer,
      reducer.initialState
    );
  });
}

function getReducerNamespaceInterfaces(
  reducerNamespaces: any[]
): ReducerNamespaceInterface[] {
  return reducerNamespaces.map((reducer, index) => {
    if (!reducer.NAME) throwMissingReducerProperty('NAME', index);
    if (!reducer.reducer) throwMissingReducerProperty('reducer', index);
    if (!reducer.initialState)
      throwMissingReducerProperty('initialState', index);
    return {
      NAME: reducer.NAME,
      reducer: reducer.reducer,
      initialState: reducer.initialState
    };
  });
}

function throwMissingReducerProperty(property: string, index: number) {
  throw Error(
    `The reducer with index ${index} in the provided reducerNameSpaces array is missing property '${property}'`
  );
}

export function getStoreModuleForFeatures(
  reducerNameSpaces: any[]
): ModuleWithProviders[] {
  return getModuleWithForFeatureProviders(
    getReducerNamespaceInterfaces(reducerNameSpaces)
  );
}
