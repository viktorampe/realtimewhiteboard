export interface MethodYearsKeyValueObject {
  [methodId: number]: MethodYearsInterface;
}

export interface MethodYearsInterface {
  id: number;
  logoUrl: string;
  name: string;
  learningAreaId: number;
  years: {
    id: number;
    name: string;
    bookId: number;
  }[];
}
