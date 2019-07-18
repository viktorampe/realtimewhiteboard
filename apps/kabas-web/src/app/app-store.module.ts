import { NgModule } from '@angular/core';
import {
  CustomSerializer,
  DiaboloPhaseReducer,
  UiReducer,
  UserReducer
} from '@campus/dal';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
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
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class AppStoreModule {}
