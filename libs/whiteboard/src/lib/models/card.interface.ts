import { CardTypeEnum } from '../enums/cardType.enum';
import { ModeEnum } from '../enums/mode.enum';
import ImageInterface from './image.interface';

export default interface CardInterface {
  id: string;
  mode: ModeEnum;
  cardType: CardTypeEnum;
  color: string;
  description: string;
  image: ImageInterface;
  top: number;
  left: number;
  viewModeImage: boolean;
}
