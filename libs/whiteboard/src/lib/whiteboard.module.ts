import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
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
import { WhiteboardToolbarComponent } from './components/whiteboard-toolbar/whiteboard-toolbar.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { ImageDragDirective } from './directives/image-drag.directive';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
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
    SettingsComponent
  ],
  providers: [{ provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }],
  exports: [WhiteboardComponent]
})
export class WhiteboardModule {}
