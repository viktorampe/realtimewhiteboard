import { Mode } from '../util/enums/mode.enum';

export default interface Card {
  mode: Mode;
  color: string;
  description: string;
  image: string;
  top: number;
  left: number;
}
