import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output
} from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMatIconRegistry } from '@campus/testing';
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
  imports: [CommonModule, NoopAnimationsModule, RouterTestingModule],
  exports: [SearchStubComponent, ResultItemMockComponent],
  providers: [
    { provide: MatIconRegistry, useClass: MockMatIconRegistry },
    { provide: SearchComponent, useValue: SearchStubComponent }
  ]
})
export class SearchTestModule {}
