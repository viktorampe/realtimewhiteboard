import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodBooksTileComponent } from './method-books-tile.component';

describe('MethodBooksTileComponent', () => {
  let component: MethodBooksTileComponent;
  let fixture: ComponentFixture<MethodBooksTileComponent>;

  const years = [
    {
      id: 1,
      name: 'L1',
      bookId: 34
    },
    {
      id: 2,
      name: 'L2',
      bookId: 35
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodBooksTileComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodBooksTileComponent);
    component = fixture.componentInstance;
    component.years = years;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('useQueryParams', () => {
    it('should set routerLink if useQueryParams is false', () => {
      const routerLink = fixture.debugElement
        .query(By.css('campus-button'))
        .injector.get<RouterLink>(RouterLink);

      expect(routerLink['commands']).toEqual([34]);
      expect(routerLink['queryParams']).toEqual({});
    });

    it('should set queryParams if useQueryParams is true', () => {
      component.useQueryParams = true;
      fixture.detectChanges();

      const routerLink = fixture.debugElement
        .query(By.css('campus-button'))
        .injector.get<RouterLink>(RouterLink);

      expect(routerLink['commands']).toEqual([]);
      expect(routerLink['queryParams']).toEqual({ book: 34 });
    });
  });
});
