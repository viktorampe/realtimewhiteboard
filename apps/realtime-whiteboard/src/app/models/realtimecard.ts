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

  constructor(cardResponse: any) {}
}
