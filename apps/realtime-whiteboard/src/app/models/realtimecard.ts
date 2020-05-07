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

  constructor(cardResponse: any) {
    this.id = cardResponse.id;
    this.mode = cardResponse.mode;
    this.type = cardResponse.type;
    this.color = cardResponse.color;
    this.description = cardResponse.description;
    this.image = {
      imageUrl: cardResponse.image
    };
    this.top = cardResponse.top;
    this.left = cardResponse.left;
    this.viewModeImage = cardResponse.viewModeImage;
    this.inShelf = cardResponse.inShelf;
    this.whiteboardId = cardResponse.whiteboardID;
    this.createdBy = cardResponse.createdBy;
    this.lastUpdatedBy = cardResponse.lastUpdatedBy;
    this.version = cardResponse._version;
  }
}
