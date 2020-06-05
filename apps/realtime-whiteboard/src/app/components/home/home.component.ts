import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'campus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  setupFormGroup: FormGroup;
  startFormGroup: FormGroup;
  playFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.setupFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.startFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.playFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
