import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-file-extension-presenter',
  templateUrl: './file-extension-presenter.component.html',
  styleUrls: ['./file-extension-presenter.component.scss']
})
export class FileExtensionPresenterComponent implements OnInit {
  @Input() extension: string;
  @Input() showTitle = true;
  @Input() showIcon = true;

  get titleContent(): string {
    return this.showTitle ? this.extension : '';
  }

  constructor() {}

  ngOnInit() {}
}
