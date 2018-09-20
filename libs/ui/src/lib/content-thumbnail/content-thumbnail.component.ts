import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent implements OnInit {
  @Input() listFormat: string;
  @Input() title: string;
  @Input() contentTypeClass: string;
  @Input() imagePath: string;
  @Input() fileExtensionClass: string;
  @Input() actions: any[];

  constructor() {}

  ngOnInit() {}
}
