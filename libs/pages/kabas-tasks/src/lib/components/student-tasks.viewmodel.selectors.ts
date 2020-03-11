import {
  EduContent,
  Result,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInstanceQueries
} from '@campus/dal';
import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskContentInterface } from '../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';

export const studentTasks$ = createSelector(
  // TODO Replace with relevaton DAL selectors
  // only done this to scaffold this selector
  [TaskInstanceQueries.getAllEntities],
  () => ({} as StudentTaskInterface)
);

export const studentTaskWithContent$ = createSelector(
  TaskInstanceQueries.getTaskInstanceWithTaskById,
  (
    taskInstance: TaskInstanceInterface,
    props: { id: number }
  ): StudentTaskWithContentInterface => {
    const task = taskInstance.task;

    const taskEduContentByEducontent = task.taskEduContents.reduce(
      (acc, tE) => Object.assign(acc, { [tE.eduContentId]: tE }),
      {}
    );
    const resultsByEducontent = groupArrayByKey(task.results, 'eduContentId');

    const name = taskInstance.task.name;
    const description = taskInstance.task.description;
    const learningAreaName = taskInstance.task.learningArea.name;
    const startDate = taskInstance.start;
    const endDate = taskInstance.end;
    const assigner = taskInstance.assigner;
    const contents = toStudentTaskContent(
      taskEduContentByEducontent,
      resultsByEducontent
    );

    return {
      name,
      description,
      learningAreaName,
      startDate,
      endDate,
      assigner,
      contents
    };
  }
);

function toStudentTaskContent(
  taskEduContentByEducontentId: Dictionary<TaskEduContentInterface>,
  resultsByEduContentId: Dictionary<Result[]>
): StudentTaskContentInterface[] {
  const eduContentIds = Object.keys(taskEduContentByEducontentId);

  return (
    eduContentIds
      .map(eCId => {
        const taskEduContent = taskEduContentByEducontentId[eCId];
        const eduContent = taskEduContent.eduContent as EduContent;
        const result = resultsByEduContentId[eCId][0];

        const name = eduContent.name;
        const description = eduContent.description;
        const icon = eduContent.fileExtension;
        const required = taskEduContent.required;
        const index = taskEduContent.index;
        const status = result.status;
        const lastUpdated = result['lastUpdated'] as Date; //TODO look into this
        const score = result.score;
        const actions = [];

        return {
          required,
          name,
          description,
          icon,
          status,
          lastUpdated,
          score,
          eduContentId: +eCId,
          index,
          actions
        };
      })
      //
      .sort((a, b) => b.index - a.index)
  );
}
