import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface GradeInterface {
  name: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
