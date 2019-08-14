import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduContentProductTypeInterface {
  name: string;
  icon?: string;
  pedagogic?: boolean;
  excludeFromFilter?: boolean;
  id?: number;
  parent?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  sequence?: number;
}
