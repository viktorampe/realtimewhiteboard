import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject, InjectionToken, NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatIconRegistry,
  MatListModule
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EditorTimelineComponent } from './components/editor-timeline/editor-timeline.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';
import {
  EditorHttpService,
  EDITOR_HTTP_SERVICE_TOKEN
} from './services/editor-http.service';

export const ENVIRONMENT_ICON_MAPPING_TOKEN = new InjectionToken(
  'EnvironmentIconMapping'
);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  declarations: [
    EditorTimelineComponent,
    SlideListComponent,
    SlideDetailComponent,
    SettingsComponent
  ],
  exports: [EditorTimelineComponent],
  providers: [
    { provide: EDITOR_HTTP_SERVICE_TOKEN, useClass: EditorHttpService }
  ]
})
export class TimelineModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(ENVIRONMENT_ICON_MAPPING_TOKEN)
    private iconMapping: { [icon: string]: string }
  ) {
    this.setupIconRegistry();
  }

  setupIconRegistry() {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIcon(
          key,
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      }
    }
  }
}
