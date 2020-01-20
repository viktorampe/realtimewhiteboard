import {
  ClassGroupQueries,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  GroupQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  LinkedPersonQueries,
  MethodInterface,
  MethodQueries,
  TaskClassGroupQueries,
  TaskEduContentInterface,
  TaskEduContentQueries,
  TaskGroupQueries,
  TaskInterface,
  TaskQueries,
  TaskStudentQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from './../interfaces/TaskWithAssignees.interface';

const taskClassGroupAssigneeByTask = createSelector(
  [TaskClassGroupQueries.getAll, ClassGroupQueries.getAllEntities],
  (taskClassGroups, classGroupDict, props) =>
    taskClassGroups.reduce((dict, tcg) => {
      if (!dict[tcg.taskId]) {
        dict[tcg.taskId] = [];
      }
      dict[tcg.taskId].push({
        type: AssigneeTypesEnum.CLASSGROUP,
        id: tcg.classGroupId,
        label: classGroupDict[tcg.classGroupId].name,
        start: tcg.start,
        end: tcg.end
      });

      return dict;
    }, {})
);

const taskGroupAssigneeByTask = createSelector(
  [TaskGroupQueries.getAll, GroupQueries.getAllEntities],
  (taskGroups, groupDict, props) =>
    taskGroups.reduce((dict, tg) => {
      if (!dict[tg.taskId]) {
        dict[tg.taskId] = [];
      }
      dict[tg.taskId].push({
        type: AssigneeTypesEnum.GROUP,
        id: tg.groupId,
        label: groupDict[tg.groupId].name,
        start: tg.start,
        end: tg.end
      });

      return dict;
    }, {})
);

const taskStudentAssigneeByTask = createSelector(
  [TaskStudentQueries.getAll, LinkedPersonQueries.getAllEntities],
  (taskStudents, personDict, props) =>
    taskStudents.reduce((dict, ts) => {
      if (!dict[ts.taskId]) {
        dict[ts.taskId] = [];
      }
      dict[ts.taskId].push({
        type: AssigneeTypesEnum.STUDENT,
        id: ts.personId,
        label: personDict[ts.personId].displayName,
        start: ts.start,
        end: ts.end
      });

      return dict;
    }, {})
);

const combinedAssigneesByTask = createSelector(
  [
    taskClassGroupAssigneeByTask,
    taskGroupAssigneeByTask,
    taskStudentAssigneeByTask
  ],
  (tCGA, tGA, tSA, props) => {
    const taskClassGroupAssigneesKeys = Object.keys(tCGA);
    const taskGroupAssigneesKeys = Object.keys(tGA);
    const taskStudentAssigneesKeys = Object.keys(tSA);

    const dict = [
      ...taskClassGroupAssigneesKeys,
      ...taskGroupAssigneesKeys,
      ...taskStudentAssigneesKeys
    ].reduce((acc, key) => {
      if (!acc[key]) {
        acc[key] = [].concat(tCGA[key] || [], tGA[key] || [], tSA[key] || []);
      }
      return acc;
    }, {});

    return dict;
  }
);

export const allowedLearningAreas = createSelector(
  [MethodQueries.getAllowedMethods, LearningAreaQueries.getAllEntities],
  (
    allowedMethods: MethodInterface[],
    learningAreas: Dictionary<LearningAreaInterface>
  ) => {
    return allowedMethods.reduce(
      (acc, allowedMethod) => {
        if (!acc.addedLearningAreasMap[allowedMethod.learningAreaId]) {
          acc.allowedLearningAreas.push(
            learningAreas[allowedMethod.learningAreaId]
          );

          acc.addedLearningAreasMap[allowedMethod.learningAreaId] = true;
        }

        return acc;
      },
      {
        addedLearningAreasMap: {},
        allowedLearningAreas: []
      }
    ).allowedLearningAreas;
  }
);

export const getTasksWithAssignments = createSelector(
  [
    TaskQueries.getAll,
    LearningAreaQueries.getAllEntities,
    TaskEduContentQueries.getAllGroupedByTaskId,
    combinedAssigneesByTask,
    FavoriteQueries.getByType
  ],
  (
    tasks: TaskInterface[],
    learningAreaDict: Dictionary<LearningAreaInterface>,
    taskEduContentByTask: Dictionary<TaskEduContentInterface[]>,
    assigneesByTask: Dictionary<AssigneeInterface[]>,
    favoriteTasks: FavoriteInterface[],
    props: {
      isPaper: boolean;
      type: FavoriteTypesEnum.TASK;
    }
  ) => {
    const favoriteTaskIds = favoriteTasks.map(fav => fav.taskId);
    return tasks
      .filter(task => !!task.isPaperTask === !!props.isPaper)
      .map(task =>
        mapToTaskWithAssigneeInterface(
          task,
          learningAreaDict[task.learningAreaId],
          taskEduContentByTask[task.id],
          assigneesByTask,
          favoriteTaskIds
        )
      );
  }
);

function mapToTaskWithAssigneeInterface(
  task: TaskInterface,
  learningArea: LearningAreaInterface,
  taskEduContents: TaskEduContentInterface[],
  assigneesByTask: Dictionary<AssigneeInterface[]>,
  favoriteTaskIds: number[]
): TaskWithAssigneesInterface {
  return addTaskDates({
    ...task,
    learningArea: learningArea,
    eduContentAmount: taskEduContents ? taskEduContents.length : 0,
    taskEduContents: taskEduContents,
    assignees: assigneesByTask[task.id] || [],
    isFavorite: favoriteTaskIds.includes(task.id)
  });
}

function addTaskDates(
  taskWithAssignees: TaskWithAssigneesInterface
): TaskWithAssigneesInterface {
  const now = new Date();
  const { assignees } = taskWithAssignees;
  let status = TaskStatusEnum.FINISHED;

  const maxDate = dates =>
    dates.length ? new Date(Math.max(...dates)) : undefined;
  const minDate = dates =>
    dates.length ? new Date(Math.min(...dates)) : undefined;

  const startDate = minDate(assignees.map(a => +a.start));
  const endDate = maxDate(assignees.map(a => +a.end));

  if (startDate && endDate) {
    if (startDate > now) {
      status = TaskStatusEnum.PENDING;
    } else if (endDate > now) {
      status = TaskStatusEnum.ACTIVE;
    }
  }

  return { ...taskWithAssignees, startDate, endDate, status };
}
