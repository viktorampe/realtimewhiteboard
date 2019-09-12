import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EduContentFixture } from '@campus/dal';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { HomeViewModel } from '../home.viewmodel';
import { MockHomeViewModel } from '../home.viewmodel.mock';
import { FavoriteMethodWithEduContent } from '../home.viewmodel.selectors';
import { MethodFavoriteTileComponent } from '../method-favorite-tile/method-favorite-tile.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let mockViewModel: HomeViewModel;

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [HomeComponent, MethodFavoriteTileComponent],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: HomeViewModel,
          useClass: MockHomeViewModel
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockViewModel = TestBed.get(HomeViewModel);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should show a welcome text containing the displayName', () => {
      const headerDE = fixture.debugElement.query(
        By.css('.pages-home__container h1')
      );

      const name = (mockViewModel.displayName$ as BehaviorSubject<string>)
        .value;

      expect(headerDE.nativeElement.textContent.trim()).toBe(
        `Welkom ${name}, dit zijn je veel gebruikte methodes:`
      );
    });

    it('should show a text if there are no favorites', () => {
      (mockViewModel.favoritesWithEduContent$ as BehaviorSubject<
        FavoriteMethodWithEduContent[]
      >).next([]);
      fixture.detectChanges();

      const noFavoritesDE = fixture.debugElement.query(
        By.css('.pages-home__no-favorites')
      );

      expect(noFavoritesDE).toBeTruthy();
      expect(noFavoritesDE.nativeElement.textContent.trim()).toBe(
        'Er zijn nog geen veel gebruikte methodes, voeg een methode toe aan je favorieten om ze hier terug te vinden.'
      );
    });

    it('should show the favorite methods', () => {
      const methodFavoriteDEs = fixture.debugElement.queryAll(
        By.directive(MethodFavoriteTileComponent)
      );

      const favorites = (mockViewModel.favoritesWithEduContent$ as BehaviorSubject<
        FavoriteMethodWithEduContent[]
      >).value;

      expect(methodFavoriteDEs).toBeTruthy();
      expect(methodFavoriteDEs.length).toBe(favorites.length);
      methodFavoriteDEs.forEach((methodFavoriteDE, index) => {
        const instance = methodFavoriteDE.componentInstance;
        const favorite = favorites[index];

        expect(instance.logoUrl).toBe(favorite.logoUrl);
        expect(instance.name).toBe(favorite.favorite.name);
        expect(instance.eduContent).toBe(favorite.eduContent);
        expect(instance.bookId).toBe(favorite.bookId);
      });
    });
  });

  describe('methods', () => {
    describe('clickOpenBoeke()', () => {
      it('should call viewmodel.openBoeke with the eduContent', () => {
        jest.spyOn(mockViewModel, 'openBoeke');

        const mockEduContent = new EduContentFixture();
        component.clickOpenBoeke(mockEduContent);

        expect(mockViewModel.openBoeke).toHaveBeenCalled();
        expect(mockViewModel.openBoeke).toHaveBeenCalledWith(mockEduContent);
      });
    });
  });
});
