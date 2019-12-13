import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule } from '@angular/material';
import { CardComponent } from './card/card.component';
import { ColorlistComponent } from './colorlist/colorlist.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { CardimageComponent } from './cardimage/cardimage.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    DragDropModule,
    FormsModule,
    MatIconModule
  ],
  declarations: [
    WhiteboardComponent,
    CardComponent,
    ToolbarComponent,
    ColorlistComponent,
    CardimageComponent
  ],
  exports: [WhiteboardComponent]
})
export class WhiteboardModule {}
