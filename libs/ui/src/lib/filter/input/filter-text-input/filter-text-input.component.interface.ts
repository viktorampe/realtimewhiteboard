import { Observable } from '../../../../../../../node_modules/rxjs';

export interface FilterTextInputComponentInterface {
  clear(): void;
  setInput(input: string): void;
  getInput(): Observable<string>;
  isClearButtonVisible(): boolean;
  setPlaceHolder(placeholder: string): void;
}
