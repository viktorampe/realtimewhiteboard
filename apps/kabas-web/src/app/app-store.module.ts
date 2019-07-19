import { NgModule } from '@angular/core';
import {
  CustomSerializer,
  DiaboloPhaseReducer,
  EduContentProductTypeReducer,
  EduContentTocReducer,
  UiReducer,
  UserReducer
} from '@campus/dal';
import { EntityState } from '@ngrx/entity';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { handleUndo } from 'ngrx-undo';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot(
      { app: undefined, router: routerReducer },
      {
        metaReducers: !environment.production
          ? [storeFreeze, handleUndo]
          : [handleUndo]
      }
    ),
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
      serializer: CustomSerializer
    }),
    StoreModule.forFeature(UiReducer.NAME, UiReducer.reducer, {
      initialState: UiReducer.initialState
    }),
    StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
      initialState: UserReducer.initialState
    }),
    StoreModule.forFeature(
      DiaboloPhaseReducer.NAME,
      DiaboloPhaseReducer.reducer,
      {
        initialState: DiaboloPhaseReducer.initialState
      }
    ),
    StoreModule.forFeature(
      EduContentProductTypeReducer.NAME,
      EduContentProductTypeReducer.reducer,
      {
        initialState: EduContentProductTypeReducer.initialState
      }
    ),
    StoreModule.forFeature(
      EduContentTocReducer.NAME,
      EduContentTocReducer.reducer,
      {
        initialState: EduContentTocReducer.initialState
      }
    ),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class AppStoreModule {}

// TODO decide if this is a good idea
// would clean up imports
function includeFeaturesInStore(
  reducers: {
    NAME: string;
    reducer: ActionReducer<any>;
    initialState: EntityState<any>;
  }[]
) {
  return reducers.map(reducer =>
    StoreModule.forFeature(reducer.NAME, reducer.reducer, {
      initialState: reducer.initialState
    })
  );
}
