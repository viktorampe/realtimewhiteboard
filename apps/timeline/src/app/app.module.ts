import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [TimelineComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' })
  ],
  entryComponents: [TimelineComponent],
  providers: []
})
export class AppModule {
  constructor(injector: Injector) {
    const timelineComponent = createCustomElement(TimelineComponent, {
      injector: injector
    });
    customElements.define('campus-timeline', timelineComponent);
  }

  ngDoBootstrap() {}
}
