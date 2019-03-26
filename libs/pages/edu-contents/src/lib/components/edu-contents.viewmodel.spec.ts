import { TestBed } from '@angular/core/testing';
import { SearchStateInterface } from '@campus/search';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;

  const mockSearchState: SearchStateInterface = {
    searchTerm: 'not this',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['thing', ['one', 'two']],
      ['other thing', ['three', 'four']]
    ])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EduContentsViewModel]
    });

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  });

  it('should be defined', () => {
    expect(eduContentsViewModel).toBeDefined();
  });

  describe('updateState', () => {
    it('should update the stream with the given value', () => {
      eduContentsViewModel['searchState$'] = new BehaviorSubject<
        SearchStateInterface
      >(null);
      eduContentsViewModel.updateState(mockSearchState);
      expect(eduContentsViewModel['searchState$']).toBeObservable(
        hot('a', { a: mockSearchState })
      );
    });
  });
});
