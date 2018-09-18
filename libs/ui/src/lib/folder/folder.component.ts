import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, AfterContentInit {
  @Input() title: string;
  @Input() itemCount: string;
  @Input() lineView: boolean;
  @Input() backgroundColor: string;
  @Input() gradientId: string;

  /**
   * Reference to the folder icon.
   * Used to determine whether the default icon should be visible.
   * @type {ElementRef<HTMLElement>}
   * @memberof FolderComponent
   */
  @ViewChild('icon') icon: ElementRef<HTMLElement>;

  /**
   * Whether to show an exclamation mark when folder is empty.
   *
   * @memberof FolderComponent
   */
  @Input()
  set errorOnEmpty(value) {
    if (value) {
      if (
        isNaN(parseInt(this.itemCount, 10)) ||
        parseInt(this.itemCount, 10) === 0
      ) {
        this.showEmptyError = true;
      }
    }
  }

  gradientUrl: string;
  showDefaultIcon = false;
  showEmptyError: boolean;

  constructor() {}

  ngOnInit() {
    this.gradientUrl = `url(#MyGradient${this.gradientId})`;
  }

  /**
   * Respond after Angular projects external content into the component's view / the view that a directive is in.
   * Called once after the first ngDoCheck().
   *
   * @memberof FolderComponent
   */
  ngAfterContentInit(): void {
    // since we use a reference to projected content (#icon in the component template),
    // we only want to check it's value after the content has been projected.
    this.setIcon();
  }

  /**
   * Checks if an icon is present, otherwise shows the default icon.
   *
   * @memberof FolderComponent
   */
  setIcon() {
    if (this.icon.nativeElement.children.length === 0) {
      this.showDefaultIcon = true;
    }
  }
}
