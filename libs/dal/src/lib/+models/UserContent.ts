import { ContentInterface } from './Content.interface';
import { PersonInterface } from './Person.interface';
import { UserContentInterface } from './UserContent.interface';

export class UserContent implements UserContentInterface, ContentInterface {
  name: string;
  description: string;
  type: string;
  link?: string;
  id?: number;
  teacherId?: number;
  teacher?: PersonInterface;
  get productType(): string {
    return '';
  }
  get fileExtension(): string {
    return 'link'; // TODO should be derived from URL
  }
}
