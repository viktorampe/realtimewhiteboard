import { ModeEnum } from '../enums/mode.enum';

export default interface CardInterface {
  id: string;
  mode: ModeEnum;
  color: string;
  description: string;
  image: string;
  top: number;
  left: number;
  viewModeImage: boolean;
}
