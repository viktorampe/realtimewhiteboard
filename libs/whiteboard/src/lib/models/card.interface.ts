import { ModeEnum } from '../enums/mode.enum';
import ImageInterface from './image.interface';

export default interface CardInterface {
  mode: ModeEnum;
  color: string;
  description: string;
  image: ImageInterface;
  top: number;
  left: number;
  viewModeImage: boolean;
}
