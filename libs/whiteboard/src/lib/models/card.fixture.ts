import { ModeEnum } from '../enums/mode.enum';
import CardInterface from './card.interface';

export class CardFixture implements CardInterface {
  mode = ModeEnum.IDLE;
  color = 'foo color';
  description = 'foo description';
  image = 'foo image';
  top = 0;
  left = 0;
  viewModeImage = true;

  constructor(props?: Partial<CardInterface>) {
    return Object.assign(this, props);
  }
}
