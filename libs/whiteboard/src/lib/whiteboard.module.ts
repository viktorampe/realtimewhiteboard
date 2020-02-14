import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageDragDirective } from '../shared/directives/image-drag.directive';
import { CardImageComponent } from './card-image/card-image.component';
import { CardTextComponent } from './card-text/card-text.component';
import { CardToolbarComponent } from './card-toolbar/card-toolbar.component';
import { CardComponent } from './card/card.component';
import { ColorListComponent } from './color-list/color-list.component';
import { ImageToolbarComponent } from './image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ShelfComponent } from './shelf/shelf.component';
import { WhiteboardToolbarComponent } from './whiteboard-toolbar/whiteboard-toolbar.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

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
    MatInputModule
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
    ShelfComponent
  ],
  exports: [WhiteboardComponent, ImageDragDirective]
})
export class WhiteboardModule {}
