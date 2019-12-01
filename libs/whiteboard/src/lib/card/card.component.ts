import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Card from '../../interfaces/Card';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('inputContent') inputContent: ElementRef;
  card: Card;
  colorlistHidden: boolean;
  @Output() lastColor = new EventEmitter<string>();
  @Input() savedLastColor: string;

  constructor() {}

  ngOnInit() {
    this.colorlistHidden = true;
    this.card = {
      color: this.savedLastColor,
      cardContent: null,
      isInputSelected: true
    };
  }

  toggleInput() {
    if (this.card.cardContent != null) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }

  showColor() {
    this.colorlistHidden = !this.colorlistHidden;
  }

  selectColor(color: string) {
    this.colorlistHidden = true;
    this.card.color = color;
    this.lastColor.emit(color);
  }
}
