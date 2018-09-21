import {
  AfterContentInit,
  AfterViewInit,
  ContentChild,
  Input,
  OnInit
} from '@angular/core';
import { FolderProgressIndicatorComponent } from './components/folder-progress-indicator/folder-progress-indicator.component';

export class BaseFolder implements OnInit, AfterContentInit, AfterViewInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() itemCount: string;
  // @Input() lineView: boolean;
  @Input() backgroundColor: string;
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

  /**
   * Reference to the progress indicator.
   * Used to determine whether the default icon should be visible.
   * @type {ElementRef<HTMLElement>}
   * @memberof FolderComponent
   */
  @ContentChild(FolderProgressIndicatorComponent)
  progressIndicator: FolderProgressIndicatorComponent;

  gradientId: string;
  gradientUrl: string;
  showDefaultIcon = false;
  showEmptyError: boolean;

  constructor() {}
  ngOnInit() {}

  ngAfterViewInit(): void {}

  /**
   * Respond after Angular projects external content into the component's view / the view that a directive is in.
   * Called once after the first ngDoCheck().
   *
   * @memberof FolderComponent
   */
  ngAfterContentInit(): void {
    this.gradientId = this.backgroundColor.replace('#', '');

    this.gradientUrl = `url(#MyGradient${this.gradientId})`;

    // since we use a reference to projected content (FolderProgressIndicator in the component template),
    // we only want to check it's value after the content has been projected.
    this.setIcon();
  }

  /**
   * Checks if an icon is present, otherwise shows the default icon.
   *
   * @memberof FolderComponent
   */
  setIcon() {
    console.log(this.progressIndicator);
    // this.showDefaultIcon = !this.progressIndicator;
    console.log('should show default icon: ', this.showDefaultIcon);
  }
}
