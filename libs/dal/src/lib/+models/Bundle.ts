import { BundleInterface } from './Bundle.interface';
import { ContentInterface } from './Content.interface';
import { ContentCollectionInterface } from './ContentCollection.interface';
import { EduContent } from './EduContent';
import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';
import { UserContent } from './UserContent';
import { UserContentInterface } from './UserContent.interface';

export class Bundle implements BundleInterface, ContentCollectionInterface {
  name: string;
  description?: string;
  start: Date;
  end: Date;
  id?: number;
  teacherId?: number;
  learningAreaId?: number;
  tasks?: TaskInterface[];
  unlockedContents?: UnlockedContentInterface[];
  eduContents?: EduContentInterface[];
  teacher?: PersonInterface;
  learningArea?: LearningAreaInterface;
  groups?: GroupInterface[];
  students?: PersonInterface[];

  get contents(): ContentInterface[] {
    if (this.unlockedContents) {
      const contents: ContentInterface[] = [];
      this.unlockedContents.forEach(unlockedContent => {
        if (unlockedContent.eduContent) {
          contents.push(
            Object.assign<EduContent, EduContentInterface>(
              new EduContent(),
              unlockedContent.eduContent
            )
          );
        } else if (unlockedContent.userContent) {
          contents.push(
            Object.assign<UserContent, UserContentInterface>(
              new UserContent(),
              unlockedContent.userContent
            )
          );
        }
      });
      return contents;
    }
  }
}
