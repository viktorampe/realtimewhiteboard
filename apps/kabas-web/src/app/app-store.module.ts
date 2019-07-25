import { NgModule } from '@angular/core';
import {
  CustomSerializer,
  DiaboloPhaseReducer,
  EduContentBookReducer,
  EduContentProductTypeReducer,
  EduContentReducer,
  EduContentTocReducer,
  MethodReducer,
  UiReducer,
  UserReducer,
  YearReducer
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
      EduContentBookReducer.NAME,
      EduContentBookReducer.reducer,
      {
        initialState: EduContentBookReducer.initialState
      }
    ),
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
    StoreModule.forFeature(MethodReducer.NAME, MethodReducer.reducer, {
      initialState: MethodReducer.initialState
    }),
    StoreModule.forFeature(YearReducer.NAME, YearReducer.reducer, {
      initialState: YearReducer.initialState
    }),
    StoreModule.forFeature(EduContentReducer.NAME, EduContentReducer.reducer, {
      initialState: EduContentReducer.initialState
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class AppStoreModule {}
