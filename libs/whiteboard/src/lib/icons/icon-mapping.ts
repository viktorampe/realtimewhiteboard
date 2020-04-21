import {
  whiteboardDropSvg,
  whiteboardEmptyStateSvg
} from './empty-states/whiteboard-empty-states';
import {
  addSvg,
  arrowDownSvg,
  colorLensSvg,
  deleteSvg,
  editSvg,
  flipCameraSvg,
  openInNewSvg,
  removeSvg,
  returnToShelfSvg
} from './material/whiteboard-material-icons';
import {
  checkSvg,
  imageDeleteSvg,
  imageEditSvg,
  multiSelectSelectedSvg,
  multiSelectSvg,
  settingsSvg
} from './whiteboard/whiteboard-icons';

// map icon name to literal SVG source of the icon (html string)
// this is needed because relative paths to the svg files do not work for angular-elements
//

export const iconMap: { [icon: string]: string } = {
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
  'empty-state-whiteboard-drop': whiteboardDropSvg,
  'return-to-shelf': returnToShelfSvg,
  'color-lens': colorLensSvg
};
