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
import { CardImageComponent } from './card-image/card-image.component';
import { CardTextComponent } from './card-text/card-text.component';
import { CardComponent } from './card/card.component';
import { ColorlistComponent } from './colorlist/colorlist.component';
import { ImageDragDirective } from './image-drag.directive';
import { ImageToolbarComponent } from './image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ShelfComponent } from './shelf/shelf.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WhiteboardToolsComponent } from './whiteboard-tools/whiteboard-tools.component';
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
    ToolbarComponent,
    ColorlistComponent,
    WhiteboardToolsComponent,
    ProgressBarComponent,
    CardImageComponent,
    ImageDragDirective,
    ProgressBarComponent,
    WhiteboardToolsComponent,
    ImageToolbarComponent,
    CardTextComponent,
    ShelfComponent
  ],
  exports: [WhiteboardComponent, ImageDragDirective]
})
export class WhiteboardModule {}
