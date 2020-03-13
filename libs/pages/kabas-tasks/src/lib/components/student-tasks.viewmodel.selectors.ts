import {
  EduContent,
  Result,
  ResultInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInstanceQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { StudentTaskContentInterface } from '../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';

export const studentTasks$ = createSelector(
  // TODO Replace with relevaton DAL selectors
  // only done this to scaffold this selector
  [TaskInstanceQueries.getTaskStudentTaskInstances],
  getTaskStudentInstances => {}
);

export const studentTaskWithContent = createSelector(
  TaskInstanceQueries.getTaskInstanceWithTaskById,
  (
    taskInstance: TaskInstanceInterface,
    props: { id: number }
  ): StudentTaskWithContentInterface => {
    const task = taskInstance.task;
    const resultByEducontentId = task.results.reduce(
      (acc, result) => Object.assign(acc, { [result.eduContentId]: result }),
      {}
    );

    const { name, description } = task;
    const learningAreaName = task.learningArea.name;

    const { assigner, start, end } = taskInstance;

    const contents = toStudentTaskContent(
      task.taskEduContents,
      resultByEducontentId
    );

    return {
      name,
      description,
      learningAreaName,
      start,
      end,
      assigner,
      contents
    };
  }
);

function toStudentTaskContent(
  taskEduContents: TaskEduContentInterface[],
  resultByEduContentId: Dictionary<Result>
): StudentTaskContentInterface[] {
  return taskEduContents.map(taskEduContent => {
    const eduContent = taskEduContent.eduContent as EduContent;
    const result =
      resultByEduContentId[taskEduContent.eduContentId] ||
      ({} as Partial<ResultInterface>);

    const { name, description } = eduContent;
    const icon = eduContent.fileExtension;

    const { eduContentId, required } = taskEduContent;

    const { status, score } = result;
    const lastUpdated = result.lastUpdated;

    const actions = []; // these are added later;

    return {
      required,
      name,
      description,
      icon,
      status,
      lastUpdated,
      score,
      eduContentId,
      actions
    };
  });
}
