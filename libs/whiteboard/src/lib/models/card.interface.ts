import { CardTypeEnum } from '../enums/cardType.enum';
import { ModeEnum } from '../enums/mode.enum';
import ImageInterface from './image.interface';

export interface CardInterface {
  id: string;
  mode: ModeEnum;
  type: CardTypeEnum;
  color: string;
  description: string;
  image: ImageInterface;
  top: number;
  left: number;
  viewModeImage: boolean;
}
