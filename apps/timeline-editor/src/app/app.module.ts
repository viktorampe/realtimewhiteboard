import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  TimelineModule
} from '@campus/timeline';
import { environment } from './../environments/environment';
import { TimelineEditorComponent } from './timeline-editor/timeline-editor.component';

@NgModule({
  declarations: [TimelineEditorComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    TimelineModule
  ],
  entryComponents: [TimelineEditorComponent],
  providers: [
    {
      provide: ENVIRONMENT_API_TOKEN,
      useValue: environment.api
    },
    {
      provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
      useValue: environment.iconMapping as { [icon: string]: string }
    }
  ]
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
