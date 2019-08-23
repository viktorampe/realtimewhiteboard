export interface KabasMethodsPagesInterface {
  kabasMethodsPages: {
    login: { username: string; password: string };
    book: number;
    chapter: number;
    lesson: number;
    searchTerm: string;
    diaboloPhase: string;
    expected: {
      method: {
        name: string;
        year: string;
      };
      boeke: {
        eduContentId: number;
      };
      generalFiles: {
        count: number;
      };
      chapters: {
        count: number;
      };
      searchNoFilters: {
        results: number;
      };
      searchByTerm: {
        results: number;
      };
      searchDiabolo: {
        results: number;
      };
    };
  };
}
