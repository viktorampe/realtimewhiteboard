import {
  EduContentInterface,
  EduContentMetadataInterface,
  EduContentNoteInterface,
  FavoriteInterface,
  ProductContentInterface,
  ResultInterface,
  TaskInterface,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeStudentInterface,
  UnlockedContentInterface
} from '../+models';

export class EduContentFixture implements EduContentInterface {
  type: string;
  id?: number;
  publishedEduContentMetadataId?: number;
  productContents?: ProductContentInterface[];
  unlockedContents?: UnlockedContentInterface[];
  unlockedBoekeStudents?: UnlockedBoekeStudentInterface[];
  unlockedBoekeGroups?: UnlockedBoekeGroupInterface[];
  tasks?: TaskInterface[];
  results?: ResultInterface[];
  eduContentMetadata?: EduContentMetadataInterface[];
  publishedEduContentMetadata?: EduContentMetadataInterface;
  notes?: EduContentNoteInterface[];
  favorites?: FavoriteInterface[];

  constructor(props: Partial<EduContentFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
