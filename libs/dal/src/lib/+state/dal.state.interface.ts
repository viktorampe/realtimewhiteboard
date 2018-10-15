import {
  BundleReducer,
  EduContentReducer,
  LearningAreaReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer
} from '../..';

export interface DalState {
  learningAreaState: LearningAreaReducer.State;
  bundleState: BundleReducer.State;
  eduContentState: EduContentReducer.State;
  userContentState: UserContentReducer.State;
  unlockedContentState: UnlockedContentReducer.State;
  unlockedBoekeGroupState: UnlockedBoekeGroupReducer.State;
  unlockedBoekeStudentState: UnlockedBoekeStudentReducer.State;
}
