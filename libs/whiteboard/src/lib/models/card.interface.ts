import { ModeEnum } from '../enums/mode.enum';

export default interface CardInterface {
  mode: ModeEnum;
  color: string;
  description: string;
  image: string;
  top: number;
  left: number;
  viewModeImage: boolean;
}
