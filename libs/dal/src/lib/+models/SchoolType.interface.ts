import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface SchoolTypeInterface {
  name: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
