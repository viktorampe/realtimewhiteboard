import { Component, Input, OnInit } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

@Component({
  selector: 'campus-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() mode: Mode;

  constructor() {}

  ngOnInit() {}

  get Mode() {
    return Mode;
  }
}
