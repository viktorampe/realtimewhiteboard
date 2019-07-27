import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchTestModule
} from '@campus/search';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from './../method.viewmodel';
import { MockMethodViewModel } from './../method.viewmodel.mock';
import { MethodChapterComponent } from './method-chapter.component';

describe('MethodChapterComponent', () => {
  let component: MethodChapterComponent;
  let fixture: ComponentFixture<MethodChapterComponent>;
  let searchComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SearchTestModule, UiModule],
      declarations: [MethodChapterComponent],
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
