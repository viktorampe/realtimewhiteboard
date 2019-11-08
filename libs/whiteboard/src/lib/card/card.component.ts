import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewInit {
  @ViewChild('inputContent') inputContent: ElementRef;
  cardContent: String = '';
  isInputSelected = true;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.inputContent.nativeElement.focus();
  }

  toggleInput() {
    this.isInputSelected = !this.isInputSelected;
  }
}
