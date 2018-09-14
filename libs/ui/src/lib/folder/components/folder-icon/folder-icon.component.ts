import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-folder-icon',
  templateUrl: './folder-icon.component.html',
  styleUrls: ['./folder-icon.component.scss']
})
export class FolderIconComponent implements OnInit {
  @Input() lineView: boolean;
  @Input() backgroundColor: string;
  @Input() progress: number;
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() iconBackgroundColor: string;
  @Input() gradientId: number;
  @Input() showEmptyError: boolean;

  constructor() {}

  ngOnInit() {}
}
