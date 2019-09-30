import { EduContentBookInterface } from './EduContentBook.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { ProductContentInterface } from './ProductContent.interface';
export interface MethodInterface {
  name: string;
  icon?: string;
  logoUrl?: string;
  experimental?: boolean;
  code?: string;
  id?: number;
  learningAreaId?: number;
  productContents?: ProductContentInterface[];
  eduContentMetadata?: EduContentMetadataInterface[];
  learningArea?: LearningAreaInterface;
  eduContentBooks?: EduContentBookInterface[];
}
