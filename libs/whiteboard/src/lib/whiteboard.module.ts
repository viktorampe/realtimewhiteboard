import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { CardComponent } from './card/card.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

@NgModule({
  imports: [CommonModule, MatCardModule, DragDropModule, FormsModule],
  declarations: [WhiteboardComponent, CardComponent],
  exports: [WhiteboardComponent]
})
export class WhiteboardModule {}
