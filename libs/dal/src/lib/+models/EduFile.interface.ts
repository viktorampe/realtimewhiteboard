import { EduContentMetadataInterface } from './EduContentMetadata.interface';

export interface EduFileInterface {
  fileName?: string;
  file?: string;
  checksum?: string;
  type: string;
  id?: number;
  eduContentMetadataId?: number;
  eduContentMetadata?: EduContentMetadataInterface;
}

export enum EduFileTypeEnum {
  EXERCISE = 'exercise',
  SOLUTION = 'solution',
  TIMELINE = 'timeline'
}
