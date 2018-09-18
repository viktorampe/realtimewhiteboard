import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent implements OnInit {
  @Input() isGrid = true;
  @Input() title: string;
  @Input() contentTypeClass: string;
  @Input() thumbnailsrc: string;
  @Input() fileExtensionClass: string;
  @Input() actions: any[];
  constructor() {}

  ngOnInit() {}
}
