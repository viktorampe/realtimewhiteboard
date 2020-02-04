import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from '@campus/ui';
import Card from '../../interfaces/card.interface';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  @ViewChild('titleInput', { static: false }) set titleInput(
    titleInput: ElementRef
  ) {
    if (titleInput) {
      titleInput.nativeElement.focus();
    }
  }

  constructor(public dialog: MatDialog) {
    this.title = '';
    this.isTitleInputSelected = this.title === '';
  }

  cards: Card[];
  // maak array van Cards
  lastColor: string;

  title: string;
  isTitleInputSelected: boolean;

  ngOnInit() {
    this.cards = [];
    this.lastColor = 'white';
  }

  onDblClick(event) {
    if (event.target.className === 'whiteboard-page__workspace') {
      const top = event.offsetY;
      const left = event.offsetX;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard(top: number = 0, left: number = 0) {
    this.cards.push({
      color: this.lastColor,
      cardContent: '',
      isInputSelected: true,
      top: top,
      left: left
    });
  }

  showTitleInput() {
    this.isTitleInputSelected = true;
  }

  hideTitleInput() {
    if (this.title !== '') {
      this.isTitleInputSelected = false;
    }
  }

  onDeleteCard(card: Card) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Verwijderen bevestigen',
        message: 'Weet u zeker dat u deze kaart wil verwijderen?',
        disableConfirm: false
      }
    });

    dialogRef.afterClosed().subscribe(deleteConfirmation => {
      if (deleteConfirmation) {
        this.cards = this.cards.filter(c => c !== card);
      }
    });
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }
}
