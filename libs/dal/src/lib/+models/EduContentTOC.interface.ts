import { EduContentBookInterface } from './EduContentBook.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
export interface EduContentTOCInterface {
  treeId: number;
  title: string;
  lft: number;
  rgt: number;
  depth: number;
  id?: number;
  eduContentBook?: EduContentBookInterface;
  eduContentMetadata?: EduContentMetadataInterface[];
  children?: EduContentTOCInterface[];
}
