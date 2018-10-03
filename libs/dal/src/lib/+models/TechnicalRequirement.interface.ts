import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface TechnicalRequirementInterface {
  name: string;
  description?: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
