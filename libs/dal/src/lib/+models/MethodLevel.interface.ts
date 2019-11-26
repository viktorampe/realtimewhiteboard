import { MethodInterface } from '.';
import { LevelInterface } from './Level.interface';

export interface MethodLevelInterface {
  id?: number;
  label: string;
  color?: string;
  icon?: string;
  methodId: number;
  method?: MethodInterface;
  levelId: number;
  level?: LevelInterface;
  iconKey?: string;
}
