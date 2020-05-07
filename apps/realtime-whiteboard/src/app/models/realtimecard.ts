import { CardTypeEnum } from 'libs/whiteboard/src/lib/enums/cardType.enum';
import { ModeEnum } from 'libs/whiteboard/src/lib/enums/mode.enum';
import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import ImageInterface from 'libs/whiteboard/src/lib/models/image.interface';

export class RealtimeCard implements CardInterface {
  id: string;
  mode: ModeEnum;
  type: CardTypeEnum;
  color: string;
  description: string;
  image: ImageInterface;
  top: number;
  left: number;
  viewModeImage: boolean;
  inShelf: boolean;
  whiteboardId: string;
  createdBy: string;
  lastUpdatedBy: string;
  version: number;

  constructor(cardResponse?: any) {
    this.id = cardResponse ? cardResponse.id : null;
    this.mode = cardResponse ? cardResponse.mode : null;
    this.type = cardResponse ? cardResponse.type : null;
    this.color = cardResponse ? cardResponse.color : null;
    this.description = cardResponse ? cardResponse.description : null;
    this.image = cardResponse
      ? {
          imageUrl: cardResponse.image
        }
      : null;
    this.top = cardResponse ? cardResponse.top : null;
    this.left = cardResponse ? cardResponse.left : null;
    this.viewModeImage = cardResponse ? cardResponse.viewModeImage : null;
    this.inShelf = cardResponse ? cardResponse.inShelf : null;
    this.whiteboardId = cardResponse ? cardResponse.whiteboardID : null;
    this.createdBy = cardResponse ? cardResponse.createdBy : null;
    this.lastUpdatedBy = cardResponse ? cardResponse.lastUpdatedBy : null;
    this.version = cardResponse ? cardResponse._version : null;
  }
}
