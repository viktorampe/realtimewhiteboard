import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output
} from '@angular/core';
import { of } from 'rxjs';
import { ResultItemBase, SearchComponent } from './components';

@Component({
  selector: 'campus-result-item',
  template: '{{data}}'
})
export class ResultItemMockComponent extends ResultItemBase {}

@Component({
  template: `
    <div></div>
  `,
  selector: 'campus-search'
})
export class SearchStubComponent {
  @Input() public searchMode;
  @Input() public autoCompleteValues;
  @Input() public autoCompleteDebounceTime;
  @Input() public initialState;
  @Input() public searchResults;
  @Input() public autoFocusSearchTerm;
  @Input() public searchPortals;
  @Output() public searchState$ = of(null);
  @Output() public searchTermChangeForAutoComplete = new EventEmitter<string>();
  reset(): void {}
}

@NgModule({
  declarations: [SearchStubComponent, ResultItemMockComponent],
  imports: [CommonModule],
  exports: [SearchStubComponent, ResultItemMockComponent],
  providers: [{ provide: SearchComponent, useValue: SearchStubComponent }]
})
export class SearchTestModule {}
