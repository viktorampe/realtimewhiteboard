export interface MethodYearsInterface {
  id: number;
  logoUrl: string;
  name: string;
  years: {
    id: number;
    name: string;
    bookId: number;
  }[];
}

export interface MethodYearsKeyValueObject {
  [methodId: number]: MethodYearValueObject;
}

export interface MethodYearValueObject {
  logoUrl: string;
  name: string;
  years: {
    id: number;
    name: string;
    bookId: number;
  }[];
}
