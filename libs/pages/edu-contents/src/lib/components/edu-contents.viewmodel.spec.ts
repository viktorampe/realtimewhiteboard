import { TestBed } from '@angular/core/testing';
import { EDU_CONTENT_SERVICE_TOKEN } from '@campus/dal';
import { SearchStateInterface } from '@campus/search';
import { BehaviorSubject, of } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let eduContentService;

  const mockSearchState: SearchStateInterface = {
    searchTerm: 'not this',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['thing', ['one', 'two']],
      ['other thing', ['three', 'four']]
    ])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentsViewModel,
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            autoComplete: (state: SearchStateInterface) => {
              return of(['strings', 'for', 'autocomplete']);
            }
          }
        }
      ]
    });

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
  });

  it('should be defined', () => {
    expect(eduContentsViewModel).toBeDefined();
  });

  describe('requestAutoComplete', () => {
    it('should call autoComplete on the eduContentService', () => {
      const autoCompleteSpy = jest.spyOn(eduContentService, 'autoComplete');
      eduContentsViewModel['searchState$'] = new BehaviorSubject<
        SearchStateInterface
      >(mockSearchState);
      eduContentsViewModel.requestAutoComplete('new search term');
      expect(autoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(autoCompleteSpy).toHaveBeenCalledWith({
        ...mockSearchState,
        searchTerm: 'new search term'
      });
    });
  });
});
