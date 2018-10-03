import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface PublisherInterface {
  name: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
