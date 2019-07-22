import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultItemBase, SearchComponent } from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MethodViewModel } from './../method.viewmodel';
import { MockMethodViewModel } from './../method.viewmodel.mock';
import { MethodChapterComponent } from './method-chapter.component';

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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div id="page-bar-container"></div>
    <campus-method-chapter></campus-method-chapter>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [
    TestContainerComponent,
    SearchStubComponent,
    MethodChapterComponent,
    ResultItemMockComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    NoopAnimationsModule,
    SharedModule,
    RouterTestingModule
  ],
  exports: [
    TestContainerComponent,
    SearchStubComponent,
    MethodChapterComponent,
    ResultItemMockComponent
  ],
  providers: [
    {
      provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
      useValue: {}
    },
    { provide: MatIconRegistry, useClass: MockMatIconRegistry },
    { provide: SearchComponent, useValue: SearchStubComponent }
  ]
})
export class TestModule {}

describe('MethodChapterComponent', () => {
  let component: MethodChapterComponent;
  let fixture: ComponentFixture<MethodChapterComponent>;
  let searchComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChapterComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
