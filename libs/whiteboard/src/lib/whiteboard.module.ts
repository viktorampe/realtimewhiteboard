import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule } from '@angular/material';
import { CardComponent } from './card/card.component';
import { ColorlistComponent } from './colorlist/colorlist.component';
import { ImageDragDirective } from './image-drag.directive';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WhiteboardToolsComponent } from './whiteboard-tools/whiteboard-tools.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { ShelfComponent } from './shelf/shelf.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    DragDropModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [
    WhiteboardComponent,
    CardComponent,
    ToolbarComponent,
    ColorlistComponent,
    ImageDragDirective,
    ProgressBarComponent,
    WhiteboardToolsComponent,
    ShelfComponent
  ],
  exports: [WhiteboardComponent, ImageDragDirective]
})
export class WhiteboardModule {}
