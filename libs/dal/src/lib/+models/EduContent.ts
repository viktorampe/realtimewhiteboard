import { ContentInterface } from './Content.interface';
import { DiaboloPhaseInterface } from './DiaboloPhase.interface';
import {
  EduContentInterface,
  EduContentTypeEnum
} from './EduContent.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { EduContentNoteInterface } from './EduContentNote.interface';
import { FavoriteInterface } from './Favorite.interface';
import { ProductContentInterface } from './ProductContent.interface';
import { ResultInterface } from './Result.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedBoekeGroupInterface } from './UnlockedBoekeGroup.interface';
import { UnlockedBoekeStudentInterface } from './UnlockedBoekeStudent.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export class EduContent implements EduContentInterface, ContentInterface {
  contentType: string;
  id?: number;
  type: EduContentTypeEnum | string;
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
  minimal?: EduContentInterface;
  get name(): string {
    return this.publishedEduContentMetadata
      ? this.publishedEduContentMetadata.title
      : '';
  }
  get productType(): string {
    return this.publishedEduContentMetadata &&
      this.publishedEduContentMetadata.eduContentProductType
      ? this.publishedEduContentMetadata.eduContentProductType.icon
      : '';
  }
  get fileExtension(): string {
    return (
      this.publishedEduContentMetadata &&
      this.publishedEduContentMetadata.fileExt
    );
  }
  get fileTypeLabel(): string {
    return (
      this.publishedEduContentMetadata &&
      this.publishedEduContentMetadata.fileLabel
    );
  }
  get previewImage(): string {
    return this.publishedEduContentMetadata
      ? this.publishedEduContentMetadata.thumbSmall
      : '';
  }
  get description(): string {
    return this.publishedEduContentMetadata
      ? this.publishedEduContentMetadata.description
      : '';
  }
  get methodLogos(): string[] {
    return this.publishedEduContentMetadata &&
    this.publishedEduContentMetadata.methods && // always return an array with an element
      this.publishedEduContentMetadata.methods[0] // but element can be undefined
      ? this.publishedEduContentMetadata.methods.map(m => 'method:' + m.icon)
      : [];
  }
  get streamable(): boolean {
    return (
      this.publishedEduContentMetadata &&
      this.publishedEduContentMetadata.streamable
    );
  }
  get diaboloPhase(): DiaboloPhaseInterface {
    return (
      this.publishedEduContentMetadata &&
      this.publishedEduContentMetadata.diaboloPhase
    );
  }
}
