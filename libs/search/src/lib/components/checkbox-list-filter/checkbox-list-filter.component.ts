import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { MatList, MatSelectionList } from '@angular/material';
import { Subscription } from 'rxjs';
import { SearchFilterComponentInterface } from '../../interfaces';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements OnDestroy, SearchFilterComponentInterface {
  public showMoreChildren = false;
  private subscriptions = new Subscription();

  @Input() maxVisibleItems = 0; // 0 == no limit
  @Input() filterCriteria: SearchFilterCriteriaInterface;

  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  @ViewChild(MatSelectionList) private matList: MatList;

  // ngAfterViewInit(): void {
  //   this.subscriptions.add(
  //     this.matList.selectionChanged
  //       .pipe(distinctUntilChanged())
  //       .subscribe(event => {
  //         event.option.value.selected = event.option.selected;

  //         this.filterSelectionChange.emit([this.filterCriteria]);
  //       })
  //   );
  // }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
