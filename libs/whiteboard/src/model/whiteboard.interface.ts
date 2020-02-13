import Card from './card.interface';

export default interface Whiteboard {
  title: string;
  defaultColor: string;
  cards: Card[];
  shelfCards: Card[];
}
