import { CardInterface } from './card.interface';
import { WhiteboardInterface } from './whiteboard.interface';

export class WhiteboardFixture implements WhiteboardInterface {
  title = 'foo title';
  cards: CardInterface[];
  shelfCards: CardInterface[];
  defaultColor: string;

  constructor(props?: Partial<WhiteboardInterface>) {
    return Object.assign(this, props);
  }
}
