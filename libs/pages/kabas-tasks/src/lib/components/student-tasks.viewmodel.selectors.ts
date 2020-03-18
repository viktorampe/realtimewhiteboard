import {
  EduContent,
  Result,
  ResultInterface,
  ResultStatus,
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
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskContentInterface } from '../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';

export const dateLabelRules = getHumanDateTimeRules([
  humanDateTimeRulesEnum.TODAY,
  humanDateTimeRulesEnum.TOMORROW,
  humanDateTimeRulesEnum.DAY_AFTER_TOMORROW,
  humanDateTimeRulesEnum.WEEKDAY,
  humanDateTimeRulesEnum.NEXT_WEEK
]);

export const dateGroupLabelRules = getHumanDateTimeRules([
  humanDateTimeRulesEnum.TODAY,
  humanDateTimeRulesEnum.TOMORROW,
  humanDateTimeRulesEnum.DAY_AFTER_TOMORROW,
  humanDateTimeRulesEnum.THIS_WEEK,
  humanDateTimeRulesEnum.PAST_WEEK,
  humanDateTimeRulesEnum.NEXT_WEEK,
  humanDateTimeRulesEnum.EARLIER,
  humanDateTimeRulesEnum.LATER
]);

export const isUrgentRules = getHumanDateTimeRules([
  humanDateTimeRulesEnum.TODAY,
  humanDateTimeRulesEnum.TOMORROW
]);

export function isUrgent(endDate: Date) {
  return isUrgentRules.some(rule =>
    rule.condition(endDate.getTime(), new Date().getTime())
  );
}

export const studentTasks = createSelector(
  [TaskInstanceQueries.getTaskStudentTaskInstances],
  taskStudentInstances => {
    return taskStudentInstances.map(tsInstance => {
      const date = new HumanDateTimePipe();
      const requiredIds = tsInstance.task.taskEduContents
        .filter(
          tec =>
            tec.required && tec.eduContent.type === EduContentTypeEnum.EXERCISE
        )
        .map(requiredTecs => requiredTecs.eduContent.id);
      const completedRequired = tsInstance.task.results.filter(res =>
        requiredIds.includes(res.eduContentId)
      );

      const result: StudentTaskInterface = {
        task: { ...tsInstance.task },
        name: tsInstance.task.name,
        description: tsInstance.task.description,
        learningAreaName: tsInstance.task.learningArea.name,
        learningAreaId: tsInstance.task.learningArea.id,
        count: {
          completedRequired: completedRequired.length,
          totalRequired: requiredIds.length
        },
        isFinished: tsInstance.end < new Date(),
        isUrgent: isUrgent(tsInstance.end),
        dateGroupLabel: date.transform(tsInstance.end, {
          rules: dateGroupLabelRules
        }),
        dateLabel:
          tsInstance.end < new Date()
            ? 'ingediend op ' + tsInstance.end.toLocaleDateString('nl-BE')
            : date.transform(tsInstance.end, {
                rules: dateLabelRules
              }),
        endDate: tsInstance.end,
        actions: [] // TaskActionService.getActions(taskInstance) (cant be done inside selector)
      };
      return result;
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

    const requiredContent = contents.filter(content => content.required);
    const totalRequired = requiredContent.length;
    const completedRequired = requiredContent.filter(
      content => content.status === ResultStatus.STATUS_COMPLETED
    ).length;

    const isFinished = end < new Date();

    return {
      name,
      description,
      learningAreaName,
      isFinished,
      start,
      end,
      assigner,
      contents,
      count: {
        totalRequired,
        completedRequired
      }
    };
  }
);

function toStudentTaskContent(
  taskEduContents: TaskEduContentInterface[],
  resultByEduContentId: Dictionary<Result>
): StudentTaskContentInterface[] {
  return taskEduContents.map(taskEduContent => {
    const eduContent = EduContent.toEduContent(taskEduContent.eduContent);
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
      actions,
      eduContent
    };
  });
}
