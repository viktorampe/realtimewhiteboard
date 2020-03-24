import CardInterface from './card.interface';

export default interface WhiteboardInterface {
  title: string;
  defaultColor: string;
  cards: CardInterface[];
  shelfCards: CardInterface[];
}
