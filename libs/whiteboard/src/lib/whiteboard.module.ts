import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { CardImageComponent } from './components/card-image/card-image.component';
import { CardTextComponent } from './components/card-text/card-text.component';
import { CardToolbarComponent } from './components/card-toolbar/card-toolbar.component';
import { CardComponent } from './components/card/card.component';
import { ColorListComponent } from './components/color-list/color-list.component';
import { ImageToolbarComponent } from './components/image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ShelfComponent } from './components/shelf/shelf.component';
import { WhiteboardStandaloneComponent } from './components/whiteboard-standalone/whiteboard-standalone.component';
import { WhiteboardToolbarComponent } from './components/whiteboard-toolbar/whiteboard-toolbar.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { ImageDragDirective } from './directives/image-drag.directive';
import { icons } from './icons/icons';

export const WHITEBOARD_ENVIRONMENT_ICON_MAPPING_TOKEN = new InjectionToken(
  'WhiteboardEnvironmentIconMapping'
);

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    DragDropModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    UiModule
  ],
  declarations: [
    WhiteboardComponent,
    CardComponent,
    CardToolbarComponent,
    ColorListComponent,
    WhiteboardToolbarComponent,
    ProgressBarComponent,
    CardImageComponent,
    ImageDragDirective,
    ProgressBarComponent,
    ImageToolbarComponent,
    CardTextComponent,
    ShelfComponent,
    SettingsComponent,
    WhiteboardStandaloneComponent
  ],
  providers: [
    { provide: WHITEBOARD_ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: icons }
  ],
  exports: [WhiteboardStandaloneComponent]
})
export class WhiteboardModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(WHITEBOARD_ENVIRONMENT_ICON_MAPPING_TOKEN)
    private iconMapping
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
        this.iconRegistry.addSvgIconLiteral(
          key,
          this.sanitizer.bypassSecurityTrustHtml(this.iconMapping[key])
        );
      }
    }
    console.log(this.iconRegistry);
  }
}
