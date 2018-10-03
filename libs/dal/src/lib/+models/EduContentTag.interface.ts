import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduContentTagInterface {
  name: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
