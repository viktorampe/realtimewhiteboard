import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { FavoriteFixture } from './../+fixtures/Favorite.fixture';
import { FavoriteInterface } from './../+models/Favorite.interface';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  let personApi: PersonApi;
  let mockUserId: number;
  let mockFavorite: FavoriteInterface;

  beforeAll(() => {
    mockUserId = 1;
    mockFavorite = new FavoriteFixture();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteService,
        {
          provide: PersonApi,
          useValue: {
            getFavorites: () => of([]),
            createFavorites: () => of({}),
            destroyByIdFavorites: () => of({})
          }
        }
      ]
    });

    favoriteService = TestBed.get(FavoriteService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created', () => {
    const service: FavoriteService = TestBed.get(FavoriteService);
    expect(service).toBeTruthy();
  });

  describe('getAllForUser', () => {
    it('should get the favorites from the api', () => {
      const mockReturnValue = [mockFavorite, mockFavorite];
      personApi.getFavorites = jest.fn().mockReturnValue(of(mockReturnValue));

      const response = favoriteService.getAllForUser(mockUserId);

      expect(personApi.getFavorites).toHaveBeenCalled();
      expect(personApi.getFavorites).toHaveBeenCalledTimes(1);
      expect(personApi.getFavorites).toHaveBeenCalledWith(mockUserId);

      expect(response).toBeObservable(cold('(a|)', { a: mockReturnValue }));
    });
  });

  describe('addFavorite', () => {
    it('should call the api and return the created favorite', () => {
      mockFavorite.id = null;
      personApi.createFavorites = jest.fn().mockReturnValue(of(mockFavorite));

      const response = favoriteService.addFavorite(mockUserId, mockFavorite);

      expect(personApi.createFavorites).toHaveBeenCalled();
      expect(personApi.createFavorites).toHaveBeenCalledTimes(1);
      expect(personApi.createFavorites).toHaveBeenCalledWith(
        mockUserId,
        mockFavorite
      );

      expect(response).toBeObservable(cold('(a|)', { a: mockFavorite }));
    });
  });

  describe('deleteFavorite', () => {
    it('should call the api and return true', () => {
      personApi.destroyByIdFavorites = jest.fn().mockReturnValue(of(null));

      const response = favoriteService.deleteFavorite(
        mockUserId,
        mockFavorite.id
      );

      expect(personApi.destroyByIdFavorites).toHaveBeenCalled();
      expect(personApi.destroyByIdFavorites).toHaveBeenCalledTimes(1);
      expect(personApi.destroyByIdFavorites).toHaveBeenCalledWith(
        mockUserId,
        mockFavorite.id
      );

      expect(response).toBeObservable(cold('(a|)', { a: true }));
    });
  });
});
