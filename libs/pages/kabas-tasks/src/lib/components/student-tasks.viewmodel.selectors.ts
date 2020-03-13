import { TaskInstanceQueries } from '@campus/dal';
import { EduContentTypeEnum } from '@campus/shared';
import {
  getHumanDateTimeRules,
  HumanDateTimePipe,
  humanDateTimeRulesEnum
} from '@campus/ui';
import { createSelector } from '@ngrx/store';

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
