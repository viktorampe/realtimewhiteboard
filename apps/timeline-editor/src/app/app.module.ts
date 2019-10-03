import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TimelineModule } from '@campus/timeline';
import { TimelineEditorComponent } from './timeline-editor/timeline-editor.component';

@NgModule({
  declarations: [TimelineEditorComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    TimelineModule
  ],
  entryComponents: [TimelineEditorComponent],
  providers: []
})
export class AppModule {
  constructor(injector: Injector) {
    const timelineEditorComponent = createCustomElement(
      TimelineEditorComponent,
      {
        injector: injector
      }
    );
    customElements.define('campus-timeline-editor', timelineEditorComponent);
  }

  ngDoBootstrap() {}
}
