export interface KabasMethodsPagesInterface {
  kabasMethodsPages: {
    login: { username: string; password: string };
    book: number;
    chapter: number;
    lesson: number;
    testData: {
      searchNoFilters: {
        expected: {
          results: number;
        };
      };
      searchByTerm: {
        searchTerm: 'de';
        expected: {
          results: number;
        };
      };
      searchDiabolo: {
        diaboloPhase: 'outro';
        expected: {
          results: number;
        };
      };
    };
  };
}
