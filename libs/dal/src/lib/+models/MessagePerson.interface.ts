import { MessageInterface } from './Message.interface';
import { PersonInterface } from './Person.interface';

export interface MessagePersonInterface {
  status?: number;
  id?: number;
  messageId?: number;
  personId?: number;
  message?: MessageInterface;
  person?: PersonInterface;
}
