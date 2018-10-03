import { ConversationInfoInterface } from './ConversationInfo.interface';
import { MessagePersonInterface } from './MessagePerson.interface';
import { PersonInterface } from './Person.interface';

export interface MessageInterface {
  conversation?: string;
  text: string;
  customDisplayName?: string;
  created: Date;
  id?: number;
  from?: number;
  person?: PersonInterface;
  targets?: PersonInterface[];
  messagePersons?: MessagePersonInterface[];
  conversationInfo?: ConversationInfoInterface;
}
