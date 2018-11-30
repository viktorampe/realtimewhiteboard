import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { PersonInterface } from '@campus/dal';
import { AppComponent } from './app.component';
import { AppViewModel } from './app.viewmodel';
describe('AppComponent', () => {
  let usedUserState;
  let user: PersonInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   StoreModule.forRoot({}),
      //   ...StateFeatureBuilder.getModuleWithForFeatureProviders([
      //     {
      //       NAME: UserReducer.NAME,
      //       reducer: UserReducer.reducer,
      //       initialState: {
      //         initialState: usedUserState
      //       }
      //     }
      //   ])
      // ],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      // providers: [Store]
      providers: [{ provide: AppViewModel, useValue: {} }]
    }).compileComponents();
  }));

  // beforeAll(() => {
  //   user = new PersonFixture();

  //   usedUserState = UserReducer.reducer(
  //     UserReducer.initialState,
  //     new UserActions.UserLoaded(user)
  //   );
  // });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
