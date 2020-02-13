import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;
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
    this.topStyle = this.top + 'px';
    this.leftStyle = this.left + 'px';
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

  showColor() {
    this.colorlistHidden = !this.colorlistHidden;
  }

  selectColor(color: string) {
    this.colorlistHidden = true;
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
    if (!this.editMode && !this.colorlistHidden) {
      this.colorlistHidden = true;
    }
    this.viewModeImage = true;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }
}
