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
  selectedCards: Card[];

  lastColor: string;
  checkboxVisible: boolean;

  title: string;
  isTitleInputSelected: boolean;

  ngOnInit() {
    this.cards = [];
    this.selectedCards = [];
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
    this.checkboxVisible = this.selectedCards.length !== 0;
    this.cards.push({
      color: this.lastColor,
      description: '',
      image:
        'https://www.cimec.co.za/wp-content/uploads/2018/07/4-Unique-Placeholder-Image-Services-for-Designers.png',
      isInputSelected: true,
      top: top,
      left: left,
      editMode: false,
      showToolbar: false
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
        this.selectedCards = this.selectedCards.filter(c => c !== card);
        this.cards = this.cards.filter(c => c !== card);
      }
    });
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }

  selectCard(card) {
    this.selectedCards.push(card);
    this.checkboxVisible = true;
  }

  deselectCard(card: Card) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);
    if (!this.selectedCards.length) {
      this.checkboxVisible = false;
    }
  }

  btnDelClicked() {
    if (this.selectedCards.length) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: {
          title: 'Verwijderen bevestigen',
          message: 'Weet u zeker dat u deze kaarten wil verwijderen?',
          disableConfirm: false
        }
      });

      dialogRef.afterClosed().subscribe(deleteConfirmation => {
        if (deleteConfirmation) {
          this.cards = this.cards.filter(c => !this.selectedCards.includes(c));
          this.selectedCards = [];
        }
      });
    }
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c => (c.color = this.lastColor));
    this.selectedCards = [];
    this.checkboxVisible = false;
  }
}
