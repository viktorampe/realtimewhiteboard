export interface KabasMethodsPagesInterface {
  kabasMethodsPages: {
    login: { username: string; password: string };
    book: number;
    chapter: number;
    lesson: number;
    searchTerm: string;
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
      lessons: {
        count: number;
      };
      chapterSearchNoFilters: {
        results: number;
      };
      chapterSearchByTerm: {
        results: number;
      };
      chapterSearchDiabolo: {
        results: number;
      };
    };
  };
}
