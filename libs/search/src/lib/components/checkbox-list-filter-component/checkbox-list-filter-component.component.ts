import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter-component.component.html',
  styleUrls: ['./checkbox-list-filter-component.component.scss']
})
export class CheckboxListFilterComponentComponent implements OnInit {
  @Input() value: string;
  form: FormGroup;

  @ViewChildren() childFilterComponents: any[];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {}

  @HostBinding('class.checkbox-filter')
  get isCheckBoxFilterClass() {
    return true;
  }
}
