import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  TimelineModule
} from '@campus/timeline';
import { environment } from '../environments/environment';
import { TimelineEditorComponent } from './timeline-editor/timeline-editor.component';

@NgModule({
  declarations: [TimelineEditorComponent],
  imports: [
    BrowserAnimationsModule,
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
      useValue: environment.iconMapping
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
