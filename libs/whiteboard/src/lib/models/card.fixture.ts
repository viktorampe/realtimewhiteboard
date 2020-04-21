import { CardTypeEnum } from '../enums/cardType.enum';
import { ModeEnum } from '../enums/mode.enum';
import { CardInterface } from './card.interface';
import ImageInterface from './image.interface';

export class CardFixture implements CardInterface {
  id = '12345-abcd'; //random id
  mode = ModeEnum.IDLE;
  type = CardTypeEnum.PUBLISHERCARD;
  color = 'foo color';
  description = 'foo description';
  image: ImageInterface = { imageUrl: 'foo image' };
  top = 0;
  left = 0;
  viewModeImage = true;

  constructor(props?: Partial<CardInterface>) {
    return Object.assign(this, props);
  }
}
