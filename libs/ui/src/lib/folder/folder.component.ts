import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() icon: string;
  @Input() progress: number;
  @Input() title: string;
  @Input() itemCount: number;
  @Input() lineView: boolean;
  @Input() backgroundColor: string;
  @Input() iconColor: string;
  @Input() iconBackgroundColor: string;
  @Input() gradientId: string;
  @Input() showEmptyError: boolean;

  gradientUrl: string;

  constructor() {}

  ngOnInit() {
    this.icon = '';
    this.progress = 0;
    this.iconColor = 'red';
    this.iconBackgroundColor = '#7D8E9D';
    this.gradientUrl = `url(#MyGradient${this.gradientId})`;
  }
}
