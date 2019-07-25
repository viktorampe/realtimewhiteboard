import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  Action,
  createFeatureSelector,
  createSelector,
  Selector,
  Store,
  StoreModule
} from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { DalState } from '..';
import { QueryWithProps, StateResolver } from './state.resolver';

class ActionOne implements Action {
  readonly type = 'ActionOne';
}

class ActionTwo implements Action {
  readonly type = 'ActionTwo';
}

const mockSelector = createFeatureSelector<any>('learningAreas');
const mockSelectorWithProp = createSelector(
  mockSelector,
  (s1, {}) => !!s1
);
let resolvedQueries = [];

@Injectable({
  providedIn: 'root'
})
class MockStateResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return resolvedQueries;
  }
}

describe('stateResolver', () => {
  let stateResolver: MockStateResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [MockStateResolver, Store]
    });
    stateResolver = TestBed.get(MockStateResolver);
  });

  it('should be created and available via DI', inject(
    [MockStateResolver],
    (service: MockStateResolver) => {
      expect(service).toBeTruthy();
    }
  ));
  describe('actionsLoaded', () => {
    it('actionsLoaded should return true if all input streams are true', () => {
      const input$: Observable<boolean>[] = [
        hot('-a-b--', { a: false, b: true }),
        hot('--a-b-', { a: false, b: true })
      ];
      expect(stateResolver['actionsLoaded'](input$)).toBeObservable(
        hot('----(b|)', {
          a: false,
          b: true
        })
      );
    });
  });
  describe('loadActions', () => {
    let dispatcher;
    beforeEach(() => {
      dispatcher = jest.spyOn(TestBed.get(Store), 'dispatch');
    });
    it('should call store.dispatch for each action ', () => {
      const actions: Action[] = [new ActionOne(), new ActionTwo()];
      stateResolver['loadActions'](actions);
      expect(dispatcher).toHaveBeenCalledTimes(2);
    });
    it('should call store.dispatch with the correct action', () => {
      const actions: Action[] = [new ActionOne()];
      stateResolver['loadActions'](actions);
      expect(dispatcher).toHaveBeenCalled();
      expect(dispatcher).toHaveBeenCalledWith({ type: 'ActionOne' });
    });
  });
  describe('resolve', () => {
    let loadActionsSpy;
    let actionsLoadedSpy;
    let selector;
    afterEach(() => {
      jest.clearAllMocks();
    });
    beforeEach(() => {
      loadActionsSpy = jest.spyOn(
        TestBed.get(MockStateResolver),
        'loadActions'
      );
      actionsLoadedSpy = jest.spyOn(
        TestBed.get(MockStateResolver),
        'actionsLoaded'
      );
      selector = jest.spyOn(TestBed.get(Store), 'pipe');
    });
    it('should call loadActions and actionsLoaded', () => {
      stateResolver.resolve({} as ActivatedRouteSnapshot);
      expect(loadActionsSpy).toHaveBeenCalledWith([]);
      expect(actionsLoadedSpy).toHaveBeenCalledWith([]);
      expect(selector).toHaveBeenCalledTimes(0);
    });
    it('should map to the store selector', () => {
      resolvedQueries = [mockSelector, mockSelector, mockSelector];
      stateResolver.resolve({} as ActivatedRouteSnapshot);
      expect(selector).toHaveBeenCalled();
    });
    it('should map to the store selector for ResolvedQueryWithProps', () => {
      resolvedQueries = [new QueryWithProps(mockSelectorWithProp, {})];
      stateResolver.resolve({} as ActivatedRouteSnapshot);
      expect(selector).toHaveBeenCalled();
    });
  });
});
