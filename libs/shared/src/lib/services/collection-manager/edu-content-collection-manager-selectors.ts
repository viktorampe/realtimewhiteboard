import { TaskQueries } from '@campus/dal';
import { createSelector } from '@ngrx/store';

export const taskCollection = createSelector(
  TaskQueries.getForLearningAreaId,
  (tasks, props) =>
    tasks.reduce(
      (acc, task) => {
        const collectionItem = {
          id: task.id,
          label: task.name,
          icon: 'task',
          linkToItem: 'tasks/manage/' + task.id
        };
        if (task.isPaperTask) {
          acc.paper.push(collectionItem);
        } else {
          acc.digital.push(collectionItem);
        }
        return acc;
      },
      { digital: [], paper: [] }
    )
);
