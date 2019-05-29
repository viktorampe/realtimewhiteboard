import { ContentInterface } from './Content.interface';
import { EduContent } from './EduContent';
import { EduContentInterface } from './EduContent.interface';
import { HistoryInterface } from './History.interface';
import { TaskInterface } from './Task.interface';

export enum HistoryTypesEnum {
  AREA = 'area',
  SEARCH = 'search',
  EDUCONTENT = 'educontent',
  BUNDLE = 'bundle',
  TASK = 'task',
  BOEKE = 'boek-e'
}

export function createHistoryFromEduContent(
  eduContent: EduContentInterface
): HistoryInterface {
  return {
    name: eduContent.publishedEduContentMetadata
      ? eduContent.publishedEduContentMetadata.title
      : '',
    type:
      eduContent.type === 'boek-e'
        ? HistoryTypesEnum.BOEKE
        : HistoryTypesEnum.EDUCONTENT,
    eduContentId: eduContent.id,
    created: new Date(),
    learningAreaId: eduContent.publishedEduContentMetadata
      ? eduContent.publishedEduContentMetadata.learningAreaId
      : null
  };
}

export function createHistoryFromTask(task: TaskInterface): HistoryInterface {
  return {
    name: task.name,
    type: HistoryTypesEnum.TASK,
    taskId: task.id,
    created: new Date(),
    learningAreaId: task.learningAreaId
  };
}

export function createHistoryFromContent(
  content: ContentInterface
): HistoryInterface {
  if (content instanceof EduContent) {
    return createHistoryFromEduContent(content);
  }

  // if it's not an instance of EduContent,
  // the provided content does not have the required properties for creating a history object
  return null;
}
