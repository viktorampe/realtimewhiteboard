import { EduContentMetadataInterface } from '.';

export interface DiaboloPhaseInterface {
  id?: number;
  name: string;
  color: string;
  icon: string;
  phase: number;
  eduContentMetadata?: EduContentMetadataInterface[];
}
