import {
  whiteboardDropSvg,
  whiteboardEmptyStateSvg
} from './empty-states/whiteboard-empty-states';
import {
  addSvg,
  arrowDownSvg,
  deleteSvg,
  editSvg,
  flipCameraSvg,
  openInNewSvg,
  removeSvg
} from './material/whiteboard-material-icons';
import {
  checkSvg,
  imageDeleteSvg,
  imageEditSvg,
  multiSelectSelectedSvg,
  multiSelectSvg,
  settingsSvg
} from './whiteboard/whiteboard-icons';

export const icons: { [icon: string]: string } = {
  check: checkSvg,
  'delete-forever': imageDeleteSvg,
  'add-photo-alternate': imageEditSvg,
  multiselect: multiSelectSvg,
  'multiselect-selected': multiSelectSelectedSvg,
  'open-in-new': openInNewSvg,
  plus: addSvg,
  delete: deleteSvg,
  flip: flipCameraSvg,
  edit: editSvg,
  settings: settingsSvg,
  remove: removeSvg,
  'arrow-down': arrowDownSvg,
  'empty-state-whiteboard-empty': whiteboardEmptyStateSvg,
  'empty-state-whiteboard-drop': whiteboardDropSvg
};
