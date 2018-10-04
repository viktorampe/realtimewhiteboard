import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduContentProductTypeInterface {
  name: string;
  icon?: string;
  pedagogic?: boolean;
  excludeFromFilter?: boolean;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
