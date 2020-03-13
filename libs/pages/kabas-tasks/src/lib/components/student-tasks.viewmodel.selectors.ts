import {
  EduContent,
  Result,
  ResultInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInstanceQueries
} from '@campus/dal';
import { EduContentTypeEnum } from '@campus/shared';
import {
  getHumanDateTimeRules,
  HumanDateTimePipe,
  humanDateTimeRulesEnum
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { StudentTaskContentInterface } from '../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';

export const studentTasks$ = createSelector(
  [TaskInstanceQueries.getTaskStudentTaskInstances],
  getTaskStudentInstances => {
    getTaskStudentInstances.map(te => {
      const date = new HumanDateTimePipe();
      const requiredIds = te.task.taskEduContents
        .filter(
          tec =>
            tec.required && tec.eduContent.type === EduContentTypeEnum.EXERCISE
        )
        .map(e => e.eduContent.id);
      const completedRequired = te.task.results.filter(res =>
        requiredIds.includes(res.eduContent.id)
      );

      return {
        name: te.task.name,
        description: te.task.description,
        learningAreaName: te.task.learningArea,
        learningAreaId: te.task.learningAreaId,
        count: {
          completedRequired: completedRequired.length,
          totalRequired: requiredIds.length
        },
        isfinished: te.end > new Date(),
        isUrgent: getHumanDateTimeRules([
          humanDateTimeRulesEnum.TOMORROW,
          humanDateTimeRulesEnum.TODAY
        ]).some(rule => rule.condition(te.end.getTime(), new Date().getTime())),
        dateGroupLabel: date.transform(te.end, {
          rules: getHumanDateTimeRules([
            humanDateTimeRulesEnum.THIS_WEEK,
            humanDateTimeRulesEnum.PAST_WEEK,
            humanDateTimeRulesEnum.EARLIER,
            humanDateTimeRulesEnum.TODAY,
            humanDateTimeRulesEnum.TOMORROW,
            humanDateTimeRulesEnum.DAY_AFTER_TOMORROW,
            humanDateTimeRulesEnum.NEXT_WEEK,
            humanDateTimeRulesEnum.LATER
          ])
        }),
        dateLabel: date.transform(te.end, {
          rules: getHumanDateTimeRules([
            humanDateTimeRulesEnum.TODAY,
            humanDateTimeRulesEnum.TOMORROW,
            humanDateTimeRulesEnum.DAY_AFTER_TOMORROW,
            humanDateTimeRulesEnum.WEEKDAY,
            humanDateTimeRulesEnum.NEXT_WEEK,
            humanDateTimeRulesEnum.DATE
          ])
        }),
        endDate: te.end,
        actions: [] // ask TaskActionService.getActions(taskInstance) (cant be done inside selector)
      };
    });
  }
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
