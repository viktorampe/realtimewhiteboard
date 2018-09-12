import { Component, Input } from '@angular/core';
/**
 * Presents the icon of an extension
 *
 * @param {string} extensionClass - The Css classname associated with the extension.
 * @param {boolean} showTitle - Sets the visibility of the title on the component.
 * @param {boolean} showIcon - Sets the visibility of the icon on the component.
 *
 * @export
 * @class FileExtensionPresenterComponent
 */
@Component({
  selector: 'campus-file-extension-presenter',
  templateUrl: './file-extension-presenter.component.html',
  styleUrls: ['./file-extension-presenter.component.scss']
})
export class FileExtensionPresenterComponent {
  @Input() extensionClass = '';
  @Input() showTitle = true;
  @Input() showIcon = true;

  get titleContent(): string {
    return this.showTitle ? this.extensionClass : '';
  }
}
