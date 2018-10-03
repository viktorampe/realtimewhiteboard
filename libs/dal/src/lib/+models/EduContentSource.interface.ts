import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduContentSourceInterface {
  name: string;
  link?: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
