import {
  BundleReducer,
  EduContentReducer,
  LearningAreaReducer,
  uiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer
} from '../..';

export interface DalState {
  ui: uiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  bundles: BundleReducer.State;
  eduContents: EduContentReducer.State;
  userContents: UserContentReducer.State;
  unlockedContents: UnlockedContentReducer.State;
  unlockedBoekeGroups: UnlockedBoekeGroupReducer.State;
  unlockedBoekeStudents: UnlockedBoekeStudentReducer.State;
}
