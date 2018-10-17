import { inject, TestBed } from '@angular/core/testing';
import { Action, createFeatureSelector, Store } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { StateResolver } from './state.resolver';

class ActionOne implements Action {
  readonly type = 'ActionOne';
}

class ActionTwo implements Action {
  readonly type = 'ActionTwo';
}

const mockSelector = createFeatureSelector<any>('learningAreas');

describe('stateResolver', () => {
  let stateResolver: StateResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateResolver,
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => {}
          }
        }
      ]
    });
    stateResolver = TestBed.get(StateResolver);
  });

  it('should be created and available via DI', inject(
    [StateResolver],
    (service: StateResolver) => {
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
    beforeEach(() => {
      loadActionsSpy = jest.spyOn(TestBed.get(StateResolver), 'loadActions');
      actionsLoadedSpy = jest.spyOn(
        TestBed.get(StateResolver),
        'actionsLoaded'
      );
      selector = jest.spyOn(TestBed.get(Store), 'select');
    });
    it('should call loadActions and actionsLoaded', () => {
      stateResolver.resolve([], []);
      expect(loadActionsSpy).toHaveBeenCalledWith([]);
      expect(actionsLoadedSpy).toHaveBeenCalledWith([]);
    });
    it('should map to the store selector', () => {
      stateResolver.resolve([], [mockSelector, mockSelector]);
      expect(selector).toHaveBeenCalledTimes(2);
    });
  });
});
