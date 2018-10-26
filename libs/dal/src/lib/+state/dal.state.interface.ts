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
import { ContentStatusReducer } from './content-status';
import { StudentContentStatusReducer } from './student-content-status';
import { UserReducer } from './user';

export interface DalState {
  ui: uiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  bundles: BundleReducer.State;
  eduContents: EduContentReducer.State;
  userContents: UserContentReducer.State;
  unlockedContents: UnlockedContentReducer.State;
  unlockedBoekeGroups: UnlockedBoekeGroupReducer.State;
  unlockedBoekeStudents: UnlockedBoekeStudentReducer.State;
  contentStatuses: ContentStatusReducer.State;
  user: UserReducer.State;
  studentContentStatuses: StudentContentStatusReducer.State;
}
