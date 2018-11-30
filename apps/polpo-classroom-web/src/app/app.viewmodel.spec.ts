import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import {
  PersonFixture,
  PersonInterface,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { AppViewModel } from './app.viewmodel';
describe('AppViewModel', () => {
  let usedUserState;
  let user: PersonInterface;
  let viewModel: AppViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppViewModel, Store]
    }).compileComponents();

    viewModel = TestBed.get(AppViewModel);
  }));

  beforeAll(() => {
    user = new PersonFixture();

    usedUserState = UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(user)
    );
  });

  it('should create the viewmodel', async(() => {
    expect(viewModel).toBeTruthy();
  }));
});
