import { CardTypeEnum } from '../enums/cardType.enum';
import { ModeEnum } from '../enums/mode.enum';
import CardInterface from './card.interface';

export class CardFixture implements CardInterface {
  id = '12345-abcd'; //random id
  mode = ModeEnum.IDLE;
  cardType = CardTypeEnum.PUBLISHERCARD;
  color = 'foo color';
  description = 'foo description';
  image = { imageUrl: 'foo image' };
  top = 0;
  left = 0;
  viewModeImage = true;

  constructor(props?: Partial<CardInterface>) {
    return Object.assign(this, props);
  }
}
