import { Observable } from '../../../../../../../node_modules/rxjs';

export interface FilterTextInputComponentInterface {
  setvalue(value: string);
  clear();
  changeInput(): Observable<string>;
  setPlaceHolder(placeholder: string);
}
