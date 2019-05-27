import { ContentInterface } from './Content.interface';
import { EduContent } from './EduContent';
import { EduContentInterface } from './EduContent.interface';
import { HistoryInterface } from './History.interface';

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

export function createHistoryFromContent(
  content: ContentInterface
): HistoryInterface {
  if (content instanceof EduContent) {
    return createHistoryFromEduContent(content);
  }

  return null;
}
