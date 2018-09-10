import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-file-extension-presenter',
  templateUrl: './file-extension-presenter.component.html',
  styleUrls: ['./file-extension-presenter.component.scss']
})
export class FileExtensionPresenterComponent implements OnInit {
  @Input() thumb: string;
  @Input() thumbSmall: string;
  @Input() extension: string;
  @Input() methods: string[];
  @Input() icon: string;
  @Input() title: string;
  @Input() label: string;
  @Input() type: string;
  @Input() description: string;

  constructor() {}

  ngOnInit() {}
}
