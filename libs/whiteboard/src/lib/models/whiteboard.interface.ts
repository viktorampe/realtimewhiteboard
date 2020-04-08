import { CardInterface } from './card.interface';

export interface WhiteboardInterface {
  title: string;
  defaultColor: string;
  cards: CardInterface[];
  shelfCards: CardInterface[];
}
