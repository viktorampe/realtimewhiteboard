import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { EditorTimelineComponent, TimelineModule } from '@campus/timeline';

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
