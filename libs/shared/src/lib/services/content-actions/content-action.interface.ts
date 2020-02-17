import { EduContent } from '@campus/dal';

export interface ContentActionInterface {
  label: string;
  icon: string;
  tooltip: string;
  handler(eduContent: EduContent): void;
}
