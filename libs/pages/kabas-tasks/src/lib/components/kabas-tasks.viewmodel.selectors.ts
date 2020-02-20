import {
  DiaboloPhaseInterface,
  DiaboloPhaseQueries,
  EduContent,
  EduContentInterface,
  EduContentQueries,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  LearningAreaInterface,
  LearningAreaQueries,
  MethodInterface,
  MethodLevelInterface,
  MethodLevelQueries,
  MethodQueries,
  TaskInterface,
  TaskQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { TaskWithAssigneesInterface } from './../interfaces/TaskWithAssignees.interface';

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

export const getTasksWithAssignmentsByType = createSelector(
  [TaskQueries.getAllTasksWithAssignments],
  (
    tasks: TaskWithAssigneesInterface[],
    props: {
      isPaper: boolean;
    }
  ) => {
    return tasks.filter(task => !!task.isPaperTask === !!props.isPaper);
  }
);

export const getTaskWithAssignmentAndEduContents = createSelector(
  [
    TaskQueries.getAllTasksWithAssignments,
    EduContentQueries.getAllEntities,
    DiaboloPhaseQueries.getAllEntities,
    MethodLevelQueries.getAll,
    MethodQueries.getAllowedMethods
  ],
  (
    tasksWithAssignments: TaskWithAssigneesInterface[],
    eduContents: Dictionary<EduContentInterface>,
    diaboloPhases: Dictionary<DiaboloPhaseInterface>,
    methodLevels: MethodLevelInterface[],
    allowedMethods: MethodInterface[],
    props: { taskId: number }
  ) => {
    const foundTask = {
      ...tasksWithAssignments.find(task => task.id === props.taskId)
    };

    foundTask.taskEduContents = foundTask.taskEduContents.length
      ? foundTask.taskEduContents.map(tEdu => {
          const eduContent = eduContents[tEdu.eduContentId];
          const methodLevel = methodLevelForEduContent(
            eduContent,
            allowedMethods,
            methodLevels
          );

          const publishedEduContentMetadata = {
            ...eduContent.publishedEduContentMetadata,
            diaboloPhase:
              diaboloPhases[
                eduContent.publishedEduContentMetadata.diaboloPhaseId
              ],
            methodLevel
          };

          return {
            ...tEdu,
            eduContent: toEduContent({
              ...eduContent,
              publishedEduContentMetadata
            })
          };
        })
      : [];

    return foundTask;
  }
);

export const getTaskFavoriteBookIds = createSelector(
  [
    TaskQueries.getAllEntities,
    FavoriteQueries.favoritesByType,
    EduContentQueries.getAllEntities
  ],
  (
    taskDict: Dictionary<TaskInterface>,
    favoritesByType: { [key: string]: FavoriteInterface[] },
    eduContentDict: Dictionary<EduContent>,
    props: {
      taskId: number;
    }
  ) => {
    const task = taskDict[props.taskId];
    const boekeFavorites = favoritesByType[FavoriteTypesEnum.BOEKE] || [];
    const taskFavoriteBooks: number[] = boekeFavorites.reduce((acc, fav) => {
      const boeke = eduContentDict[fav.eduContentId];
      if (!boeke) return acc;

      const {
        learningAreaId,
        eduContentBookId
      } = boeke.publishedEduContentMetadata;

      return learningAreaId === task.learningAreaId
        ? [...acc, eduContentBookId]
        : acc;
    }, []);

    return taskFavoriteBooks;
  }
);

function methodLevelForEduContent(
  eduContent: EduContentInterface,
  allowedMethods: MethodInterface[],
  methodLevels: MethodLevelInterface[]
) {
  const allowedEduContentMethodId = eduContent.publishedEduContentMetadata.methodIds.find(
    methodId =>
      allowedMethods.some(allowedMethod => allowedMethod.id === methodId)
  );

  return methodLevels.find(
    mLevel =>
      mLevel.methodId === allowedEduContentMethodId &&
      mLevel.levelId === eduContent.publishedEduContentMetadata.levelId
  );
}

function toEduContent(eduContent: EduContentInterface) {
  return Object.assign<EduContent, EduContentInterface>(
    new EduContent(),
    eduContent
  );
}
