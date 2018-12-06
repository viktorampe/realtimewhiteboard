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
  fileExt: string;
  get productType(): string {
    return '';
  }
  get fileExtension(): string {
    return this.fileExt;
  }
  get fileTypeLabel(): string {
    return this.fileExt;
  }
  getFile;
}
