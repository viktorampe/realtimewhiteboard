import {
  EduContent,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface
} from '@campus/dal';

export interface QuickLinkCategoryInterface {
  type: FavoriteTypesEnum | string; //history has string as type type
  title: string;
  quickLinks: QuickLinkInterface[];
  order: number;
}

export interface QuickLinkInterface
  extends FavoriteInterface,
    HistoryInterface {
  defaultAction: QuickLinkActionInterface;
  alternativeOpenActions: QuickLinkActionInterface[];
  manageActions: QuickLinkActionInterface[];
  // override eduContent property -> is always cast to EduContent
  eduContent?: EduContent;
}

export interface QuickLinkActionInterface {
  actionType: 'open' | 'manage';
  label: string;
  icon: string;
  tooltip: string;
  handler: string;
}

export const QuickLinkCategoryMap: Map<
  FavoriteTypesEnum | string,
  { label: string; order: number }
> = new Map<FavoriteTypesEnum | string, { label: string; order: number }>([
  // Favorites
  [FavoriteTypesEnum.BOEKE, { label: 'Bordboeken', order: 0 }],
  [FavoriteTypesEnum.EDUCONTENT, { label: 'Lesmateriaal', order: 1 }],
  [FavoriteTypesEnum.SEARCH, { label: 'Zoekopdrachten', order: 2 }],
  [FavoriteTypesEnum.BUNDLE, { label: 'Bundels', order: 3 }],
  [FavoriteTypesEnum.TASK, { label: 'Taken', order: 4 }],
  // History
  ['boek-e', { label: 'Bordboeken', order: 0 }],
  ['educontent', { label: 'Lesmateriaal', order: 1 }],
  ['history', { label: 'Zoekopdrachten', order: 2 }], // TODO: change history to 'search' in the selectors
  ['bundle', { label: 'Bundels', order: 3 }],
  ['task', { label: 'Taken', order: 4 }]
]);

export const quickLinkActionDictionary = {
  openEduContentAsExercise: {
    actionType: 'open',
    label: 'Openen',
    icon: 'exercise:open',
    tooltip: 'Open oefening zonder oplossingen',
    handler: 'openEduContentAsExercise'
  } as QuickLinkActionInterface,

  openEduContentAsSolution: {
    actionType: 'open',
    label: 'Toon oplossing',
    icon: 'exercise:finished',
    tooltip: 'Open oefening met oplossingen',
    handler: 'openEduContentAsSolution'
  } as QuickLinkActionInterface,

  openEduContentAsStream: {
    actionType: 'open',
    label: 'Openen',
    icon: 'lesmateriaal',
    tooltip: 'Open het lesmateriaal',
    handler: 'openEduContentAsStream'
  } as QuickLinkActionInterface,

  openEduContentAsDownload: {
    actionType: 'open',
    label: 'Downloaden',
    icon: 'download',
    tooltip: 'Download het lesmateriaal',
    handler: 'openEduContentAsDownload'
  } as QuickLinkActionInterface,

  openBundle: {
    actionType: 'open',
    label: 'Openen',
    icon: 'bundle',
    tooltip: 'Navigeer naar de bundel pagina',
    handler: 'openBundle'
  } as QuickLinkActionInterface,

  openTask: {
    actionType: 'open',
    label: 'Openen',
    icon: 'task',
    tooltip: 'Navigeer naar de taken pagina',
    handler: 'openTask'
  } as QuickLinkActionInterface,

  openArea: {
    actionType: 'open',
    label: 'Openen',
    icon: 'lesmateriaal',
    tooltip: 'Navigeer naar de leergebied pagina',
    handler: 'openArea'
  } as QuickLinkActionInterface,

  openBoeke: {
    actionType: 'open',
    label: 'Openen',
    icon: 'boeken',
    tooltip: 'Open het bordboek',
    handler: 'openBoeke'
  } as QuickLinkActionInterface,

  openSearch: {
    actionType: 'open',
    label: 'Openen',
    icon: 'magnifier',
    tooltip: 'Open de zoekopdracht',
    handler: 'openSearch'
  } as QuickLinkActionInterface,

  edit: {
    actionType: 'manage',
    label: 'Bewerken',
    icon: 'edit',
    tooltip: 'Pas de naam van het item aan',
    handler: 'edit'
  } as QuickLinkActionInterface,

  remove: {
    actionType: 'manage',
    label: 'Verwijderen',
    icon: 'delete',
    tooltip: 'Verwijder het item',
    handler: 'remove'
  } as QuickLinkActionInterface
};
