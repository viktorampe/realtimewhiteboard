import { TaskInstanceQueries } from '@campus/dal';
import { EduContentTypeEnum } from '@campus/shared';
import { createSelector } from '@ngrx/store';
import { TaskActionsService } from 'libs/shared/src/lib/services/task/task-actions.service';
import { HumanDateTimePipe } from 'libs/ui/src/lib/utils/pipes/human-date-time/human-date-time.pipe';
import {
  getHumanDateTimeRules,
  humanDateTimeRulesEnum
} from 'libs/ui/src/lib/utils/pipes/human-date-time/human-date-time.pipe.presets';

let taskActionService: TaskActionsService;

export const studentTasks$ = createSelector(
  [TaskInstanceQueries.getTaskStudentTaskInstances],
  getTaskStudentInstances => {
    getTaskStudentInstances.map(te => {
      const requiredIds = te.task.taskEduContents
        .filter(
          tec =>
            tec.required && tec.eduContent.type === EduContentTypeEnum.EXERCISE
        )
        .map(e => e.eduContent.id);
      const completedRequired = te.task.results.filter(res =>
        requiredIds.includes(res.eduContent.id)
      );

      let date: HumanDateTimePipe;
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
            humanDateTimeRulesEnum.LAST_WEEK,
            humanDateTimeRulesEnum.LAST_TRIMESTER,
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
