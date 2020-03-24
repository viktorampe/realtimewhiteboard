import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorTimelineComponent, TimelineModule } from '@campus/timeline';
import {
  WhiteboardModule,
  WhiteboardStandaloneComponent
} from '@campus/whiteboard';

@NgModule({
  imports: [
    BrowserModule,
    TimelineModule,
    BrowserAnimationsModule,
    WhiteboardModule
  ],
  entryComponents: [EditorTimelineComponent, WhiteboardStandaloneComponent] //place additional custom components here and ...
})
export class ElementModule {
  constructor(injector: Injector) {
    const timelineEditorComponent = createCustomElement(
      EditorTimelineComponent,
      {
        injector: injector
      }
    );

    const whiteboardComponent = createCustomElement(
      WhiteboardStandaloneComponent,
      {
        injector: injector
      }
    );
    customElements.define('campus-whiteboard', whiteboardComponent);
    customElements.define('campus-editor-timeline', timelineEditorComponent); //... and here
  }

  ngDoBootstrap() {}
}
