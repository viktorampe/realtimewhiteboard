import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule } from '@angular/material';
import { CardComponent } from './card/card.component';
import { ColorlistComponent } from './colorlist/colorlist.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

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
    ColorlistComponent
  ],
  exports: [WhiteboardComponent]
})
export class WhiteboardModule {}
