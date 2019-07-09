import { NgModule } from '@angular/core';
import {
  AlertReducer,
  BundleReducer,
  ContentStatusReducer,
  CredentialReducer,
  CurrentExerciseReducer,
  CustomSerializer,
  EduContentProductTypeReducer,
  EduContentReducer,
  EduNetReducer,
  EffectFeedbackReducer,
  FavoriteReducer,
  HistoryReducer,
  LearningAreaReducer,
  LearningDomainReducer,
  LinkedPersonReducer,
  MethodReducer,
  ResultReducer,
  SchoolTypeReducer,
  StudentContentStatusReducer,
  TaskEduContentReducer,
  TaskInstanceReducer,
  TaskReducer,
  TeacherStudentReducer,
  UiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer,
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
    StoreModule.forFeature(
      LearningAreaReducer.NAME,
      LearningAreaReducer.reducer,
      { initialState: LearningAreaReducer.initialState }
    ),
    StoreModule.forFeature(
      LearningDomainReducer.NAME,
      LearningDomainReducer.reducer,
      { initialState: LearningDomainReducer.initialState }
    ),
    StoreModule.forFeature(MethodReducer.NAME, MethodReducer.reducer, {
      initialState: MethodReducer.initialState
    }),
    StoreModule.forFeature(
      UserContentReducer.NAME,
      UserContentReducer.reducer,
      { initialState: UserContentReducer.initialState }
    ),
    StoreModule.forFeature(
      UnlockedContentReducer.NAME,
      UnlockedContentReducer.reducer,
      { initialState: UnlockedContentReducer.initialState }
    ),
    StoreModule.forFeature(
      StudentContentStatusReducer.NAME,
      StudentContentStatusReducer.reducer,
      { initialState: StudentContentStatusReducer.initialState }
    ),
    StoreModule.forFeature(EduContentReducer.NAME, EduContentReducer.reducer, {
      initialState: EduContentReducer.initialState
    }),
    StoreModule.forFeature(BundleReducer.NAME, BundleReducer.reducer, {
      initialState: BundleReducer.initialState
    }),
    StoreModule.forFeature(UiReducer.NAME, UiReducer.reducer, {
      initialState: UiReducer.initialState
    }),
    StoreModule.forFeature(
      UnlockedBoekeGroupReducer.NAME,
      UnlockedBoekeGroupReducer.reducer,
      { initialState: UnlockedBoekeGroupReducer.initialState }
    ),
    StoreModule.forFeature(
      UnlockedBoekeStudentReducer.NAME,
      UnlockedBoekeStudentReducer.reducer,
      { initialState: UnlockedBoekeStudentReducer.initialState }
    ),
    StoreModule.forFeature(
      ContentStatusReducer.NAME,
      ContentStatusReducer.reducer,
      { initialState: ContentStatusReducer.initialState }
    ),
    StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
      initialState: UserReducer.initialState
    }),
    StoreModule.forFeature(TaskReducer.NAME, TaskReducer.reducer, {
      initialState: TaskReducer.initialState
    }),
    StoreModule.forFeature(AlertReducer.NAME, AlertReducer.reducer, {
      initialState: AlertReducer.initialState
    }),
    StoreModule.forFeature(
      TaskInstanceReducer.NAME,
      TaskInstanceReducer.reducer,
      { initialState: TaskInstanceReducer.initialState }
    ),
    StoreModule.forFeature(
      TaskEduContentReducer.NAME,
      TaskEduContentReducer.reducer,
      { initialState: TaskEduContentReducer.initialState }
    ),
    StoreModule.forFeature(ResultReducer.NAME, ResultReducer.reducer, {
      initialState: ResultReducer.initialState
    }),
    StoreModule.forFeature(
      CurrentExerciseReducer.NAME,
      CurrentExerciseReducer.reducer,
      { initialState: CurrentExerciseReducer.initialState }
    ),
    StoreModule.forFeature(
      TeacherStudentReducer.NAME,
      TeacherStudentReducer.reducer,
      { initialState: TeacherStudentReducer.initialState }
    ),
    StoreModule.forFeature(
      LinkedPersonReducer.NAME,
      LinkedPersonReducer.reducer,
      { initialState: LinkedPersonReducer.initialState }
    ),
    StoreModule.forFeature(CredentialReducer.NAME, CredentialReducer.reducer, {
      initialState: CredentialReducer.initialState
    }),
    StoreModule.forFeature(
      EffectFeedbackReducer.NAME,
      EffectFeedbackReducer.reducer,
      { initialState: EffectFeedbackReducer.initialState }
    ),
    StoreModule.forFeature(FavoriteReducer.NAME, FavoriteReducer.reducer, {
      initialState: FavoriteReducer.initialState
    }),
    StoreModule.forFeature(HistoryReducer.NAME, HistoryReducer.reducer, {
      initialState: HistoryReducer.initialState
    }),
    StoreModule.forFeature(
      EduContentProductTypeReducer.NAME,
      EduContentProductTypeReducer.reducer,
      { initialState: EduContentProductTypeReducer.initialState }
    ),
    StoreModule.forFeature(EduNetReducer.NAME, EduNetReducer.reducer, {
      initialState: EduNetReducer.initialState
    }),
    StoreModule.forFeature(SchoolTypeReducer.NAME, SchoolTypeReducer.reducer, {
      initialState: SchoolTypeReducer.initialState
    }),
    StoreModule.forFeature(YearReducer.NAME, YearReducer.reducer, {
      initialState: YearReducer.initialState
    }),
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
      serializer: CustomSerializer
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class AppStoreModule {}
