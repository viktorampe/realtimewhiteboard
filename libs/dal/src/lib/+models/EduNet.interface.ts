import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduNetInterface {
  name: string;
  code: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
