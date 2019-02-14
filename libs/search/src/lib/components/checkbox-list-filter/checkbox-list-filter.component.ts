import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SearchFilterComponentInterface as SFCoI,
  SearchFilterCriteriaInterface as SFCrI
} from '../../interfaces';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent<T, K>
  implements
    SFCoI.SearchFilterComponentInterface<T, K>,
    OnInit,
    AfterContentInit,
    OnDestroy {
  filterCriteria: SFCrI.SearchFilterCriteriaInterface<T, K>;

  filterSelectionChange = new EventEmitter<
    | SFCrI.SearchFilterCriteriaInterface<T, K>
    | SFCrI.SearchFilterCriteriaInterface<T, K>[]
  >();

  valueChanged = new EventEmitter<CheckboxListFilterChangedEvent<T, K>>();

  @Input() value: string;
  @Input() isFirst = false;

  public get checked(): boolean {
    return this._checked;
  }

  public set checked(value: boolean) {
    if (value !== this._checked) {
      this._checked = value;
      this.valueChanged.next({
        childRef: this,
        criterium: this.filterCriteria,
        checked: this._checked
      });
    }
  }

  @ContentChildren(CheckboxListFilterComponent, { descendants: true })
  public filterComponents: QueryList<CheckboxListFilterComponent<T, K>>;

  private _checked: boolean;
  private subscriptions: Subscription = new Subscription();
  private childrenCriteria: CheckboxListFilterChangedEvent<T, K>[] = [];

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.isFirst) {
      this.filterComponents.forEach(child => {
        this.subscribeToChildEvent(child);
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostBinding('class.checkbox-filter')
  get isCheckBoxFilterClass() {
    return true;
  }

  private subscribeToChildEvent(child: CheckboxListFilterComponent<T, K>) {
    this.childrenCriteria = [
      ...this.childrenCriteria,
      {
        childRef: child,
        criterium: child.filterCriteria,
        checked: child.checked
      }
    ];
    this.subscriptions.add(
      child.valueChanged.subscribe(
        (event: CheckboxListFilterChangedEvent<T, K>) => {
          this.childrenCriteria = [
            ...this.childrenCriteria.filter(
              crit => crit.childRef !== event.childRef
            ),
            event
          ];

          const filteredCriteria = this.childrenCriteria.filter(
            crit => crit.checked === true
          );

          this.filterSelectionChange.next(
            filteredCriteria.map(crit => crit.criterium)
          );
          console.log(
            'filterSelectionChange',
            filteredCriteria.map(c => c.childRef.value)
          );
        }
      )
    );
  }
}

export interface CheckboxListFilterChangedEvent<T, K> {
  childRef: CheckboxListFilterComponent<T, K>;
  criterium: SFCrI.SearchFilterCriteriaInterface<T, K>;
  checked: boolean;
}
