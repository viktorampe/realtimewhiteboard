import { EduContentMetadataInterface } from '@campus/dal';

export interface DiaboloPhaseInterface {
  id?: number;
  name: string;
  color: string;
  icon: string;
  phase: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
