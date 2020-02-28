import CardInterface from './card.interface';

export default interface WhiteboardInterface {
  title: string;
  cards: CardInterface[];
  shelfCards: CardInterface[];
}
