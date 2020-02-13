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
import { FormControl } from '@angular/forms';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @ViewChild('inputContent', { static: false }) inputContent: ElementRef;
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;
  @Input() isInputSelected: boolean;
  @Input() editMode: boolean;
  @Input() top: number;
  @Input() left: number;
  @Input() checkboxVisible: boolean;
  @Input() isSelected: boolean;

  @Output() deleteCard = new EventEmitter();
  @Output() lastColor = new EventEmitter<string>();
  @Output() select = new EventEmitter<void>();
  @Output() deselect = new EventEmitter<void>();

  @HostBinding('style.top') topStyle: string;
  @HostBinding('style.left') leftStyle: string;
  viewModeImage: boolean;
  maxCharacters = 300;
  pressTime: number;
  optionsVisible: boolean;

  txtContent = new FormControl();

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {
    this.optionsVisible = false;
  }

  ngOnChanges() {
    this.topStyle = this.top + 'px';
    this.leftStyle = this.left + 'px';
  }

  toggleInput() {
    if (
      this.description !== '' &&
      this.description.length <= this.maxCharacters
    ) {
      this.isInputSelected = !this.isInputSelected;
    }
  }

  onImageClicked($event) {}

  removeImage() {
    this.image = '';
  }

  replaceImage(url: string) {
    this.image = url;
  }

  onDeleteCard() {
    this.deleteCard.emit();
  }

  showImageSettings() {
    //TODO: show modal with options --> 'select img from this computer', 'remove image'
    //this.removeImage();
    this.replaceImage('hello_world');
  }

  onDblClick() {
    this.toggleEditMode();
  }

  selectColor(color: string) {
    this.optionsVisible = false;
    this.color = color;
    this.lastColor.emit(color);
  }

  onCheckboxChanged(event) {
    if (event.target.checked) {
      this.select.emit();
    } else {
      this.deselect.emit();
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode && !this.optionsVisible) {
      this.optionsVisible = true;
    }
    this.viewModeImage = true;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }

  registerPress($event) {
    this.pressTime = event.timeStamp;
  }

  showCardOptions($event) {
    const releaseTime = event.timeStamp;
    const holdTime = releaseTime - this.pressTime;
    if (holdTime >= 1000) {
      this.optionsVisible = !this.optionsVisible;
      console.log('long press registered!');
    }
  }
}
