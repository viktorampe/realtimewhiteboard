import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { EditorTimelineComponent } from './lib/components/editor-timeline/editor-timeline.component';
import { TimelineModule } from './lib/timeline.module';

@NgModule({
  imports: [BrowserModule, TimelineModule],
  entryComponents: [EditorTimelineComponent] //place additional files here
})
export class ElementModule {
  constructor(injector: Injector) {
    const timelineEditorComponent = createCustomElement(
      EditorTimelineComponent,
      {
        injector: injector
      }
    );
    customElements.define('campus-editor-timeline', timelineEditorComponent);
  }

  ngDoBootstrap() {}
}
