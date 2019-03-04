import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { hot } from 'jasmine-marbles';
import { Subject } from 'rxjs';
import { SearchStateInterface } from '../../interfaces';
import { SearchViewModel } from '../search.viewmodel';
import { MockSearchViewModel } from '../search.viewmodel.mock';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchViewmodel: SearchViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [{ provide: SearchViewModel, useClass: MockSearchViewModel }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    searchViewmodel = TestBed.get(SearchViewModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searchState', () => {
    it('should emit the viewmodel searchState$ value', () => {
      const mockSearchState = null; //TODO delete this when mock is merged
      (searchViewmodel.searchState$ as Subject<SearchStateInterface>).next(
        mockSearchState
      );

      expect(component.searchState).toBeObservable(
        hot('a', { a: mockSearchState })
      );
    });
  });
});
