import { ScormCMIMode } from '../enums/cmi-mode.enum';
import { ScormStatus } from '../enums/scorm-status.enum';

export interface CmiInterface {
  mode: ScormCMIMode;
  core: {
    score: {
      raw: number;
      min?: number; //undefined
      max?: number; //undefined
    };
    lesson_location?: string; //''
    lesson_status: ScormStatus;
    total_time: string; //'0000:00:00'
    session_time?: string; //'0000:00:00'
  };
  objectives?: {
    score: {
      raw: number; //0
      min: number; //undefined
      max: number; //undefined
      scale: any; //undefined
    };
    status: ScormStatus;
    id: string; //'points'
  }[];
  suspend_data?: {
    startTime: number;
    endTime: number;
  }[];
}
