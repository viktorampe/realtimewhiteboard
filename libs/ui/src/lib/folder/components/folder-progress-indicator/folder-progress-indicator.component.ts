import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-folder-progress-indicator',
  templateUrl: './folder-progress-indicator.component.html',
  styleUrls: ['./folder-progress-indicator.component.scss']
})
export class FolderProgressIndicatorComponent implements OnInit {
  /**
   * Indicates the progress in time.
   *
   * @type {number}
   * @memberof FolderComponent
   */
  @Input() progress: number;
  @Input() icon: string;
  @Input() lineView: boolean;

  iconColor: string;
  iconBackgroundColor: string;

  constructor() {}

  ngOnInit() {
    this.setIconColors();
  }

  setIconColors() {
    this.iconColor = '#7D8E9D';
    this.iconBackgroundColor = '#7D8E9D';

    if (this.progress > 0) {
      this.iconColor = '#578EBE';
      this.iconBackgroundColor = '#495266';
    }
  }

  setViewMode(lineView: boolean) {
    this.lineView = lineView;
  }
}
