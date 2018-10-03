import { MessageInterface } from './Message.interface';

export interface ConversationInfoInterface {
  id?: string;
  name: string;
  messages?: MessageInterface[];
}
