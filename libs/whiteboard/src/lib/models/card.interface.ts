import { Mode } from '../enums/mode.enum';

export default interface CardInterface {
  mode: Mode;
  color: string;
  description: string;
  image: string;
  top: number;
  left: number;
  viewModeImage: boolean;
}
