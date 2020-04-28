import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';

export class UpdateHelper {
  constructor() {}
  public static checkForUpdates(
    currentWhiteboard: WhiteboardInterface,
    updatedWhiteboard: WhiteboardInterface
  ) {
    console.log(currentWhiteboard, updatedWhiteboard);
    if (currentWhiteboard.title !== updatedWhiteboard.title)
      console.log('Update title!');
    if (currentWhiteboard.defaultColor !== updatedWhiteboard.defaultColor)
      console.log('Update defaultColor');
    if (currentWhiteboard.cards !== updatedWhiteboard.cards)
      console.log('Update Cards');
    if (currentWhiteboard.shelfCards !== updatedWhiteboard.shelfCards)
      console.log('Update Shelfcards');
  }
}
