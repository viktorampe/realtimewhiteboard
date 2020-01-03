import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  DalState,
  PersonFixture,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { ENVIRONMENT_WEBSITE_TOKEN } from '@campus/shared';
import { MockActivatedRoute, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let activatedRoute: MockActivatedRoute;
  let store: Store<DalState>;

  const mockWebsite = {
    url: 'http://www.foo.bar'
  };
  const displayName = 'Foo Bar';

  const usedUserState = {
    currentUser: new PersonFixture({ displayName: displayName }),
    loaded: true
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          }
        ]),
        UiModule
      ],
      providers: [
        Store,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        {
          provide: ENVIRONMENT_WEBSITE_TOKEN,
          useValue: mockWebsite
        },
        {
          provide: MatIconRegistry,
          useClass: MockMatIconRegistry
        }
      ],
      declarations: [ErrorComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  describe('creation', () => {
    beforeEach(() => {
      activatedRoute.params.next({ code: 'foo' });
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should get the necessary data', () => {
      expect(component.currentUser$).toBeObservable(
        hot('a', { a: usedUserState.currentUser })
      );

      expect(component.statusCode$).toBeObservable(hot('a', { a: 'foo' }));

      expect(component.website.url).toBe(mockWebsite.url);
    });
  });

  describe('when logged in', () => {
    it('should show the correct error message', () => {
      assertErrorMessage(
        401,
        `Je hebt niet de juiste bevoegdheden om deze actie uit te voeren. Je ben aangemeld als ${displayName}.`
      );
    });
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      store.dispatch(new UserActions.UserRemoved());
      fixture.detectChanges();
    });
    it('should show the correct error', () => {
      assertErrorMessage(
        401,
        'Je bent niet aangemeld. Klik hier om in te loggen.'
      );

      assertErrorMessage(
        500,
        'Er is iets fout gegaan. Ga terug naar de vorige pagina en probeer opnieuw.'
      );

      assertErrorMessage(700, 'Er is iets fout gegaan. Probeer opnieuw.');
    });
  });

  function assertErrorMessage(errorCode: number, expectedErrorMessage: string) {
    activatedRoute.params.next({ code: errorCode });
    expect(component.statusCode$).toBeObservable(hot('a', { a: errorCode }));
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('p')).nativeElement.textContent
    ).toBe(expectedErrorMessage);
  }
});
