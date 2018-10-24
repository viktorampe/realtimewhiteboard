import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  EduContentInterface
} from '@campus/dal';
import { StateResolver } from '@campus/pages/shared';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BundlesViewModel } from '../bundles.viewmodel';
import { BundlesComponent } from './bundles.component';

class MockViewModel extends BundlesViewModel {}

let bundlesViewModel: MockViewModel;

function createEduContent(): EduContentInterface {
  return {
    type: '?'
  };
}

function createBundle(name: string, learningAreaId: number): BundleInterface {
  const startDate: Date = new Date();
  const endDate: Date = new Date();
  endDate.setHours(endDate.getHours() + 2);

  return {
    id: Math.round(Math.random() * 10000),
    teacherId: Math.round(Math.random() * 10000),
    learningAreaId: learningAreaId,
    name: name,
    description: 'this description includes' + name,
    start: startDate,
    end: endDate,
    eduContents: [
      createEduContent(),
      createEduContent(),
      createEduContent(),
      createEduContent(),
      createEduContent()
    ]
  };
}

function filterBundlesExpect(
  component: BundlesComponent,
  filterInput: string,
  allBundles: BundleInterface[],
  filteredBundles: BundleInterface[]
) {
  component.filterInput$.next(filterInput);
  expect(
    component.getDisplayedBundles(
      hot('a', { a: allBundles }),
      component.filterInput$
    )
  ).toBeObservable(
    hot('a', {
      a: filteredBundles
    })
  );
}

beforeEach(() => {
  bundlesViewModel = new MockViewModel(
    new StateResolver(<Store<any>>{}),
    <Store<any>>{},
    new ActivatedRoute()
  );
});

describe('BundlesComponent', () => {
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;

  const bundle1 = createBundle('text for search one', 19);
  const bundle2 = createBundle('text for search two', 20);
  const bundle3 = createBundle('text for search three', 983);
  const bundle4 = createBundle('text for search four', 378);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [BundlesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BundlesViewModel,
        { provide: ActivatedRoute, value: {} },
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },

        Store
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    component.filterInput$.next('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should return all bundles', () => {
    filterBundlesExpect(
      component,
      '',
      [bundle1, bundle2, bundle3, bundle4],
      [bundle1, bundle2, bundle3, bundle4]
    );
  });

  it('should filter out all but 1 bundle, case insensitve', () => {
    filterBundlesExpect(
      component,
      'tWo',
      [bundle1, bundle2, bundle3, bundle4],
      [bundle2]
    );
  });

  it('should return a no bundles', () => {
    filterBundlesExpect(
      component,
      'not in the list',
      [bundle1, bundle2, bundle3, bundle4],
      []
    );
  });

  it('should reset filter input', () => {
    component.filterInput$.next('lol');
    component.resetFilterInput();
    expect(component.filterInput$).toBeObservable(hot('a', { a: '' }));
  });

  it('should change filter input', () => {
    component.onChangeFilterInput('changedFilterInput');
    expect(component.filterInput$).toBeObservable(
      hot('a', { a: 'changedFilterInput' })
    );
  });

  it('should change listformat', () => {
    const spy = jest.spyOn(component['bundlesViewModel'], 'changeListFormat');
    component.clickChangeListFormat(ListFormat.LINE);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.LINE);
  });
});
