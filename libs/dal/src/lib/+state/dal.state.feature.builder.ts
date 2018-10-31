import { InjectionToken, ModuleWithProviders } from '@angular/core';
import { Action, ActionReducer, StoreModule } from '@ngrx/store';
export interface ReducerNamespaceInterface {
  NAME: string;
  reducer:
    | ActionReducer<any, Action>
    | InjectionToken<ActionReducer<any, Action>>;
  initialState: any;
}

/**
 * secondary function to build` StoreModule.forFeature()` array that can be imported in another module
 * 
 * if for some reason, a namespace can not contain all properties to make use of the `getStoreModuleForFeatures` function,
 * this function can be used to build the input objects yourself
 * 
 * this function is accessable outside this lib using the barrelled `StateFeatureBuilder`
 * 
 * @example
 * imports: [
 *  OtherImports,
 *  ...getModuleWithForFeatureProviders([
 *    { NAME: 'someName', reducer: theReducer, initialState: someInitialState }
 *  ]),
    ...getStoreModuleForFeatures([
      NameSpaceOfReducer,
      NameSpaceOfOtherReducer
    ])
  ]
 *
 *
 * @export
 * @param {ReducerNamespaceInterface[]} reducers
 * @returns {ModuleWithProviders[]}
 */
export function getModuleWithForFeatureProviders(
  reducers: ReducerNamespaceInterface[]
): ModuleWithProviders[] {
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

/**
 * function to build `StoreModule.forFeature()` array that can be imported in another module
 * 
 * if the namespace is missing a property, a runtime error will be thrown with the index of the reducer that is missing a property and the missing property
 * 
 * this function is accessable outside this lib using the barraled `StateFeatureBuilder`
 * 
 * @example
 * imports: [
 *  OtherImports,
    ...getStoreModuleForFeatures([
      NameSpaceOfReducer,
      NameSpaceOfOtherReducer
    ])
  ]
 *
 * @export
 * @param {any[]} reducerNameSpaces
 * @returns {ModuleWithProviders[]}
 */
export function getStoreModuleForFeatures(
  reducerNameSpaces: any[]
): ModuleWithProviders[] {
  return getModuleWithForFeatureProviders(
    getReducerNamespaceInterfaces(reducerNameSpaces)
  );
}
