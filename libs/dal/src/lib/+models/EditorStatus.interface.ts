import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EditorStatusInterface {
  name: string;
  color: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
