import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { ListFormat, ListViewItemDirective, UiModule } from '@campus/ui';
import { BehaviorSubject, Subject } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import { MockViewModel } from '../bundles.viewmodel.mocks';
import { BundlesComponent } from './bundles.component';

describe('BundlesComponent', () => {
  let params: Subject<Params>;
  let bundlesViewModel: BundlesViewModel;
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1 });
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [BundlesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: { params: params } },
        { provide: BundlesViewModel, useClass: MockViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    }).compileComponents();
    bundlesViewModel = TestBed.get(BundlesViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(bundlesViewModel, 'changeListFormat');
    component.clickChangeListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should get the listFormat$ from the vm', () => {
    expect(component.listFormat$).toBe(bundlesViewModel.listFormat$);
  });

  it('should apply the filter case insensitive on the list of bundles', async(() => {
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    expect(listItems.length).toBe(4);

    component.filterTextInput.setValue('foo');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const filteredListItems = listDE.queryAll(
        By.directive(ListViewItemDirective)
      );
      expect(filteredListItems.length).toBe(3);
    });
  }));

  it(
    'should call vm.getLearningAreaById and vm.getSharedBundlesWithContentInfo on route change',
    fakeAsync(() => {
      const spyLearningArea = jest.spyOn(
        bundlesViewModel,
        'getLearningAreaById'
      );
      const spyBundles = jest.spyOn(
        bundlesViewModel,
        'getSharedBundlesWithContentInfo'
      );
      params.next({ area: 2 });
      tick(); // make sure the async observable resolves

      expect(spyLearningArea).toHaveBeenCalledTimes(1);
      expect(spyLearningArea).toHaveBeenCalledWith(2);
      expect(spyBundles).toHaveBeenCalledTimes(2); // subscribed 2 times to sharedInfo$ in the template
      expect(spyBundles).toHaveBeenCalledWith(2);
    })
  );
});
