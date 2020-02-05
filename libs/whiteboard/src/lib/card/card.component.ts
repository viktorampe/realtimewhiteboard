import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Card from '../../interfaces/card.interface';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @ViewChild('inputContent', { static: false }) inputContent: ElementRef;
  @Input() card: Card;
  @Output() deleteCard = new EventEmitter();
  @Output() lastColor = new EventEmitter<string>();

  @HostBinding('style.top') topStyle: string;
  @HostBinding('style.left') leftStyle: string;
  colorlistHidden: boolean;
  viewModeImage: boolean;
  maxCharacters = 300;

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {
    this.colorlistHidden = true;
  }

  ngOnChanges() {
    this.topStyle = this.card.top + 'px';
    this.leftStyle = this.card.left + 'px';
  }

  toggleInput() {
    if (
      this.card.description !== '' &&
      this.card.description.length <= this.maxCharacters
    ) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }

  removeImage() {
    this.card.image = '';
  }

  onDeleteCard() {
    this.deleteCard.emit();
  }

  showImageSettings() {
    //TODO: show modal with options --> 'select img from this computer', 'remove image'
    this.removeImage();
  }

  onDblClick(event) {
    const classArray = event.target.className.split(' ');
    if (
      classArray.some(
        e => e === 'cardImage' || e === 'card__input' || e === 'card'
      )
    ) {
      this.toggleEditMode();
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

  toggleEditMode() {
    this.card.editMode = !this.card.editMode;
    this.viewModeImage = true;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }
}
