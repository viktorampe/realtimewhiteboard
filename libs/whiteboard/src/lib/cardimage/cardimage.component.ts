import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-cardimage',
  templateUrl: './cardimage.component.html',
  styleUrls: ['./cardimage.component.scss']
})
export class CardimageComponent implements OnInit {
  editMode: boolean;

  constructor() {}

  ngOnInit() {}

  setEditMode(editMode: boolean) {
    this.editMode = editMode;
  }
}
