import { Directive, ElementRef, Inject, Renderer2 } from '@angular/core';
import {
  EnvironmentTestingInterface,
  ENVIRONMENT_TESTING_TOKEN
} from '../interfaces';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[data-cy]'
})
export class DataCyDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(ENVIRONMENT_TESTING_TOKEN)
    private environmentTesting: EnvironmentTestingInterface
  ) {
    if (this.environmentTesting.removeDataCyAttributes) {
      this.renderer.removeAttribute(this.el.nativeElement, 'data-cy');
    }
  }
}
