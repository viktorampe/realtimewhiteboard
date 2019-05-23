import { ContentInterface } from './Content.interface';
import { EduContent } from './EduContent';
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
  eduContent: EduContent
): HistoryInterface {
  return {
    name: eduContent.name,
    type:
      eduContent.type === 'boek-e'
        ? HistoryTypesEnum.BOEKE
        : HistoryTypesEnum.EDUCONTENT,
    eduContentId: eduContent.id,
    created: new Date(),
    learningAreaId: eduContent.publishedEduContentMetadata.learningAreaId
  };
}
export function createHistoryFromContent(
  content: ContentInterface,
  contentType: HistoryTypesEnum,
  learningAreaId: number
): HistoryInterface {
  if (content instanceof EduContent) {
    return {
      name: content.name,
      type: contentType,
      eduContentId: content.id,
      created: new Date(),
      learningAreaId: learningAreaId
    };
  }

  return null;
}
