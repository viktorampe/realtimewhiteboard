import {
  ClassGroupQueries,
  GroupQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  LinkedPersonQueries,
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
import { TaskWithAssigneesInterface } from './../interfaces/TaskWithAssignees.interface';

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
        label: personDict[ts.personId].name,
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

export const getTasksWithAssignments = createSelector(
  [
    TaskQueries.getAll,
    LearningAreaQueries.getAllEntities,
    TaskEduContentQueries.getAllGroupedByTaskId,
    combinedAssigneesByTask
  ],
  (
    tasks: TaskInterface[],
    learningAreaDict: Dictionary<LearningAreaInterface>,
    taskEduContentByTask: Dictionary<TaskEduContentInterface[]>,
    assigneesByTask: Dictionary<AssigneeInterface[]>,
    props: { isPaper?: boolean }
  ) =>
    tasks
      .filter(task => !!task.isPaperTask === !!props.isPaper)
      .map(
        (task): TaskWithAssigneesInterface => ({
          ...task,
          learningArea: learningAreaDict[task.learningAreaId],
          eduContentAmount: taskEduContentByTask[task.id]
            ? taskEduContentByTask[task.id].length
            : 0,
          assignees: assigneesByTask[task.id] || []
        })
      )
);
