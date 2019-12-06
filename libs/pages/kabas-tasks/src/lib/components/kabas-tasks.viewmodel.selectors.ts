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

export enum AssigneeType {
  'CLASSGROUP' = 'classGroup',
  'GROUP' = 'group',
  'STUDENT' = 'student'
}

interface AssigneeInterface {
  type: AssigneeType;
  label: string;
  start: Date;
  end: Date;
}

interface TaskWithAssigneesInterface extends TaskInterface {
  eduContentAmount: number;
  assignees: AssigneeInterface[];
}

const taskClassGroupAssignees = createSelector(
  [TaskClassGroupQueries.getAll, ClassGroupQueries.getAllEntities],
  (taskClassGroups, classGroupDict, props) =>
    taskClassGroups.map(tcg => ({
      type: AssigneeType.CLASSGROUP,
      label: classGroupDict[tcg.classGroupId].name,
      start: tcg.start,
      end: tcg.end
    }))
);

const taskGroupAssignees = createSelector(
  [TaskGroupQueries.getAll, GroupQueries.getAllEntities],
  (taskGroups, groupDict, props) =>
    taskGroups.map(tg => ({
      type: AssigneeType.GROUP,
      label: groupDict[tg.groupId].name,
      start: tg.start,
      end: tg.end
    }))
);

const taskStudentAssignees = createSelector(
  [TaskStudentQueries.getAll, LinkedPersonQueries.getAllEntities],
  (taskStudents, personDict, props) =>
    taskStudents.map(ts => ({
      type: AssigneeType.STUDENT,
      label: personDict[ts.personId].name,
      start: ts.start,
      end: ts.end
    }))
);

const taskAssignees = createSelector(
  [taskClassGroupAssignees, taskGroupAssignees, taskStudentAssignees],
  (tCGA, tGA, tSA, props) => [...tCGA, ...tGA, ...tSA]
);

export const getTasksWithAssignments = createSelector(
  [
    TaskQueries.getAll,
    LearningAreaQueries.getAllEntities,
    TaskEduContentQueries.getAllGroupedByTaskId,
    taskAssignees
  ],
  (
    tasks: TaskInterface[],
    learningAreaDict: Dictionary<LearningAreaInterface>,
    taskEduContentByTask: Dictionary<TaskEduContentInterface[]>,
    assignees: AssigneeInterface[],
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
          assignees
        })
      )
);
