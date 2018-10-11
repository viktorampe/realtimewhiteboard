import { ContentStatusInterface } from '@campus/dal';

export interface ContentInterface {
  name: string;
  id?: string;
  type: ContentType;
  productType: string;
  fileExtension: string;
  previewImage?: string;
  description: string;
  methodLogos?: string[];
  actions?: string[];
  status: ContentStatusInterface;
}

export enum ContentType {
  EDUCONTENT = 'educontent',
  USERCONTENT = 'usercontent'
}
