import {
  AlertReducer,
  BundleReducer,
  EduContentReducer,
  LearningAreaReducer,
  UiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer
} from '../..';
import { ContentStatusReducer } from './content-status';
import { StudentContentStatusReducer } from './student-content-status';
import { UserReducer } from './user';

export interface DalState {
  ui: UiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  bundles: BundleReducer.State;
  eduContents: EduContentReducer.State;
  userContents: UserContentReducer.State;
  unlockedContents: UnlockedContentReducer.State;
  unlockedBoekeGroups: UnlockedBoekeGroupReducer.State;
  unlockedBoekeStudents: UnlockedBoekeStudentReducer.State;
  alerts: AlertReducer.State;
  contentStatuses: ContentStatusReducer.State;
  user: UserReducer.State;
  studentContentStatuses: StudentContentStatusReducer.State;
}
