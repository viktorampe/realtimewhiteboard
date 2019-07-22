export interface MethodYearsInterface {
  [methodId: number]: {
    logoUrl: string;
    name: string;
    years: {
      id: number;
      name: string;
      bookId: number;
    }[];
  };
}
