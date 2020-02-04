export default interface Card {
  color: string;
  description: string;
  image: File;
  isInputSelected: boolean;
  editMode: boolean;
  top: number;
  left: number;
}
