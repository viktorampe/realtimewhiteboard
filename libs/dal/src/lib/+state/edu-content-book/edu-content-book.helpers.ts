import { EduContentBookInterface } from '../../+models';
import { State } from './edu-content-book.reducer';

export function createState(
  eduContentBooks: EduContentBookInterface[],
  loaded: boolean = false,
  error?: any
): State {
  return {
    ids: eduContentBooks
      ? eduContentBooks.map(eduContentBook => eduContentBook.id)
      : [],
    entities: eduContentBooks
      ? eduContentBooks.reduce(
          (entityMap, eduContentBook) => ({
            ...entityMap,
            [eduContentBook.id]: eduContentBook
          }),
          {}
        )
      : {},
    loaded: loaded,
    error: error
  };
}

export interface CreateEduContentBookOptions {
  methodId?: number;
  years?: {
    id: number;
    name: string;
  }[];
  diabolo?: boolean;
}

export function createEduContentBook(
  id: number,
  options?: CreateEduContentBookOptions
): EduContentBookInterface | any {
  const data: EduContentBookInterface | any = {
    id: id
  };
  if (options) {
    if (options.methodId) {
      data.methodId = options.methodId;
      data.method = {
        name: `method ${options.methodId}`,
        logoUrl: `logo for method ${options.methodId}`
      };
    }
    if (options.years) data.years = options.years;
    if (options.diabolo) data.diabolo = options.diabolo;
  }
  return data;
}
