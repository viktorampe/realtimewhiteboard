import { Injectable } from '@angular/core';

export interface WhiteboardConfigInterface {
  apiBase: string;
  canManage: boolean;
  eduContentMetadataId: number;
}
@Injectable({ providedIn: 'root' })
export class WhiteboardConfigService {
  private config = {
    apiBase: null,
    canManage: null,
    eduContentMetadataId: null
  };

  constructor() {}

  setConfig(config: WhiteboardConfigInterface): void {
    this.config = config;
    console.log(this.config);
  }

  getConfig(): WhiteboardConfigInterface {
    return this.config;
  }
}
