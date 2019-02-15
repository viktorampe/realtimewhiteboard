import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent implements AfterViewInit {
  @Input()
  selectFilter: SearchFilterCriteriaInterface;
  @Output()
  selectedFilters = new EventEmitter<SearchFilterCriteriaInterface[]>();

  private subscriptions = new Subscription();
  constructor() {}

  @ViewChild(MatSelectionList) private matList: MatSelectionList;

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.matList.selectionChange.subscribe(
        (event: MatSelectionListChange) => {
          this.selectedFilters.next(event.source.selectedOptions.selected);
        }
      )
    );
  }
}
