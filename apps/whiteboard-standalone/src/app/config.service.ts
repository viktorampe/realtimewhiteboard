import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhiteboardConfigService {
  // this is the data that's seeded
  private _eduContentMetadataEduContentMap = {
    22: 24,
    123: 125,
    124: 126,
    125: 127,
    251: 128
  };

  constructor() {}

  previewInWrapper(apiBase: string, eduContentMetadataId: number) {
    const url = `${apiBase}/eduContents/${this._eduContentMetadataEduContentMap[eduContentMetadataId]}/redirectURL/${eduContentMetadataId}`;

    window.open(url);
  }
}
