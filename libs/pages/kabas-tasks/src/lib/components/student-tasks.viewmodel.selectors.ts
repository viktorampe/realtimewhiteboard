import { TaskInstanceQueries } from '@campus/dal';
import { createSelector } from '@ngrx/store';

export const studentTasks$ = createSelector(
  // TODO Replace with relevaton DAL selectors
  // only done this to scaffold this selector
  [TaskInstanceQueries.getTaskStudentTaskInstances],
  getTaskStudentInstances => {}
);
