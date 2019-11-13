import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import Card from '../../interfaces/Card';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewInit {
  @ViewChild('inputContent') inputContent: ElementRef;

  card: Card;

  constructor() {}

  ngOnInit() {
    this.card = {
      color: '',
      cardContent: null,
      isInputSelected: true
    };
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  toggleInput() {
    this.card.isInputSelected = !this.card.isInputSelected;
  }

  focusInput() {
    this.inputContent.nativeElement.focus();
  }
}
