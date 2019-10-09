import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { SettingsService, SETTINGS_SERVICE_TOKEN } from '@campus/timeline';

@Component({
  // selector: 'campus-timeline-editor',
  templateUrl: './timeline-editor.component.html',
  styleUrls: ['./timeline-editor.component.scss']
})
export class TimelineEditorComponent implements OnInit, OnChanges {
  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;

  constructor(
    @Inject(SETTINGS_SERVICE_TOKEN)
    private settingsService: SettingsService
  ) {
    this.settingsService.eduContentMetadataId = 1;
    this.settingsService.APIBase = 'http://api.lk2020.localhost:3000/api';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eduContentMetadataId) {
      this.settingsService.eduContentMetadataId = this.eduContentMetadataId;
    }
    if (changes.apiBase) {
      this.settingsService.APIBase = this.apiBase;
    }
  }

  ngOnInit() {}
}
