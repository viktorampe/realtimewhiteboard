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
  @Input() toolbarsVisible: boolean;
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

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {}

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
    this.toggleToolbar();
  }

  selectColor(color: string) {
    this.toolbarsVisible = false;
    this.editMode = false;
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

  toggleToolbar() {
    this.toolbarsVisible = !this.toolbarsVisible;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }
}
