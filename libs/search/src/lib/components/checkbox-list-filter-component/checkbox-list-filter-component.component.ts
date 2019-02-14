import {
  AfterContentInit,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnInit,
  QueryList
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter-component.component.html',
  styleUrls: ['./checkbox-list-filter-component.component.scss']
})
export class CheckboxListFilterComponentComponent
  implements OnInit, AfterContentInit {
  @Input() value: string;
  form: FormGroup;

  // @ViewChildren(CheckboxListFilterComponentComponent)
  @ContentChildren(CheckboxListFilterComponentComponent)
  childFilterComponents: QueryList<CheckboxListFilterComponentComponent>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.childFilterComponents.forEach(cfc => console.log(cfc));
  }

  @HostBinding('class.checkbox-filter')
  get isCheckBoxFilterClass() {
    return true;
  }
}
