import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { EduContentTOCInterface } from './EduContentTOC.interface';

export interface EduContentTOCEduContentMetadataInterface {
  id?: number;
  eduContentTOCId?: number;
  eduContentTOC?: EduContentTOCInterface;
  eduContentMetadataId?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
