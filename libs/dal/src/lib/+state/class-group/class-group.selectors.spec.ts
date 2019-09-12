import { EduContentBookFixture } from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { ClassGroupQueries } from '.';
import { ClassGroupFixture, YearFixture } from '../../+fixtures';
import { ClassGroupInterface } from '../../+models/ClassGroup.interface';
import { ProductContentInterface } from '../../+models/ProductContent.interface';
import { State } from './class-group.reducer';
import { getClassGroupsForBook } from './class-group.selectors';

describe('ClassGroup Selectors', () => {
  function createClassGroup(
    id: number,
    productContents?: ProductContentInterface[]
  ): ClassGroupInterface | any {
    return {
      id: id,
      licenses: productContents
        ? [{ product: { productContents: productContents } }]
        : undefined
    };
  }

  function createState(
    classGroups: ClassGroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: classGroups ? classGroups.map(classGroup => classGroup.id) : [],
      entities: classGroups
        ? classGroups.reduce(
            (entityMap, classGroup) => ({
              ...entityMap,
              [classGroup.id]: classGroup
            }),
            {} as Dictionary<ClassGroupInterface>
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let classGroupState: State;
  let storeState: any;

  describe('ClassGroup Selectors', () => {
    beforeEach(() => {
      classGroupState = createState(
        [
          createClassGroup(4),
          createClassGroup(1),
          createClassGroup(2),
          createClassGroup(3)
        ],
        true,
        'no error'
      );
      storeState = { classGroups: classGroupState };
    });
    it('getError() should return the error', () => {
      const results = ClassGroupQueries.getError(storeState);
      expect(results).toBe(classGroupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ClassGroupQueries.getLoaded(storeState);
      expect(results).toBe(classGroupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = ClassGroupQueries.getAll(storeState);
      expect(results).toEqual([
        createClassGroup(4),
        createClassGroup(1),
        createClassGroup(2),
        createClassGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = ClassGroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = ClassGroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = ClassGroupQueries.getAllEntities(storeState);
      expect(results).toEqual(classGroupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = ClassGroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createClassGroup(3),
        createClassGroup(1),
        undefined,
        createClassGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = ClassGroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createClassGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = ClassGroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    describe('getClassGroupsByMethodId', () => {
      const classGroups = [
        createClassGroup(1, [
          { licenseType: 'notmethod', methodId: 1 },
          { licenseType: 'method', methodId: 2 }
        ]),
        createClassGroup(2, [
          { licenseType: 'notmethod', methodId: 1 },
          { licenseType: 'method', methodId: 2 },
          { licenseType: 'method', methodId: 3 }
        ])
      ];
      beforeEach(() => {
        classGroupState = createState(classGroups, true, 'no error');
        storeState = { classGroups: classGroupState };
      });

      it('should return the classGroups grouped by methodId', () => {
        const results = ClassGroupQueries.getClassGroupsByMethodId(storeState);
        expect(results).toEqual({
          2: [classGroups[0], classGroups[1]],
          3: [classGroups[1]]
        });
      });
    });

    describe('getClassGroupsForBook', () => {
      const projector = getClassGroupsForBook.projector;
      const years = [
        new YearFixture({ id: 1, label: 'L1' }),
        new YearFixture({ id: 2, label: 'L2' }),
        new YearFixture({ id: 3, label: 'L3' })
      ];
      const book = new EduContentBookFixture({
        id: 1,
        methodId: 1,
        years: [years[0], years[1]]
      });
      const classGroupsByMethodId = {
        1: [
          new ClassGroupFixture({ id: 1, years: [years[0]] }),
          new ClassGroupFixture({ id: 2, years: [years[1]] }),
          new ClassGroupFixture({ id: 3, years: [years[1], years[2]] }),
          new ClassGroupFixture({ id: 4, years: [years[2]] })
        ],
        2: [new ClassGroupFixture({ id: 5, years: [years[0]] })]
      };

      it("should return the classGroups for the book's method and year", () => {
        const methodClassGroups = classGroupsByMethodId[1];

        expect(projector(book, classGroupsByMethodId)).toEqual([
          methodClassGroups[0],
          methodClassGroups[1],
          methodClassGroups[2]
        ]);
      });
    });
  });
});
