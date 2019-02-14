import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit, AfterContentInit {
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngAfterContentInit() {}
}
