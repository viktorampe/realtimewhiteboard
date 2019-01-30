import { CommonModule } from '@angular/common';
import {
  Component,
  Directive,
  NgModule,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed
} from '@angular/core/testing';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Action, Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { FeedbackService } from '.';
import { DalState } from '../+state';
import { ActionSuccessful } from '../+state/dal.actions';
import { getStoreModuleForFeatures } from '../+state/dal.state.feature.builder';
import {
  EffectFeedbackInterface,
  EffectFeedbackReducer,
  Priority
} from '../+state/effect-feedback';
import {
  AddEffectFeedback,
  DeleteEffectFeedback
} from '../+state/effect-feedback/effect-feedback.actions';
import { EffectFeedbackFixture } from './../+fixtures/EffectFeedback.fixture';
import {
  SnackBarDefaultConfig,
  SNACKBAR_DEFAULT_CONFIG_TOKEN
} from './snackbar.config';

// tslint:disable:no-use-before-declare
describe('FeedbackService', () => {
  let store: Store<DalState>;
  let mockFeedBack: EffectFeedbackInterface;
  let service: FeedbackService;
  let defaultSnackbarConfig: MatSnackBarConfig;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeAll(() => {
    const mockAction = {
      title: 'klik',
      userAction: new ActionSuccessful({ successfulAction: 'test' })
    };

    mockFeedBack = new EffectFeedbackFixture({
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [mockAction],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([EffectFeedbackReducer]),
        MatSnackBarModule,
        SnackBarTestModule // -> see end of file for details
      ],
      providers: [
        Store,
        MatSnackBar,
        {
          provide: SNACKBAR_DEFAULT_CONFIG_TOKEN,
          useClass: SnackBarDefaultConfig
        }
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    service = TestBed.get(FeedbackService);

    viewContainerFixture = TestBed.createComponent(
      ComponentWithChildViewContainer
    );

    viewContainerFixture.detectChanges();
    testViewContainerRef =
      viewContainerFixture.componentInstance.childViewContainer;

    defaultSnackbarConfig = TestBed.get(SNACKBAR_DEFAULT_CONFIG_TOKEN);
    defaultSnackbarConfig.viewContainerRef = testViewContainerRef;
  });

  describe('creation', () => {
    it('should be created', inject(
      [FeedbackService],
      (srv: FeedbackService) => {
        expect(srv).toBeTruthy();
      }
    ));
  });

  describe('success feedback', () => {
    let snackbar: MatSnackBar;
    let removeFeedbackAction: Action;

    beforeAll(() => {
      removeFeedbackAction = new DeleteEffectFeedback({ id: mockFeedBack.id });
    });

    beforeEach(() => {
      snackbar = TestBed.get(MatSnackBar);
    });

    it('should call the snackbarService, without a userAction', () => {
      snackbar.open = jest.fn();
      const mockFeedBackWithoutActions = { ...mockFeedBack, userActions: null };
      store.dispatch(
        new AddEffectFeedback({ effectFeedback: mockFeedBackWithoutActions })
      );

      expect(snackbar.open).toHaveBeenCalled();
      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith(
        mockFeedBack.message,
        null,
        jasmine.anything()
      );
    });

    it('should call the snackbarService, with a userAction', () => {
      snackbar.open = jest.fn();
      store.dispatch(new AddEffectFeedback({ effectFeedback: mockFeedBack }));

      expect(snackbar.open).toHaveBeenCalled();
      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith(
        mockFeedBack.message,
        mockFeedBack.userActions[0].title,
        jasmine.anything()
      );
    });

    it('should use the default setings when calling the snackbar', () => {
      snackbar.open = jest.fn();
      store.dispatch(new AddEffectFeedback({ effectFeedback: mockFeedBack }));

      expect(snackbar.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        defaultSnackbarConfig
      );
    });

    it('should dispatch a removeFeedbackAction when the snackbar is dismissed without an action', fakeAsync(() => {
      store.dispatch(new AddEffectFeedback({ effectFeedback: mockFeedBack }));
      store.dispatch = jest.fn();

      snackbar.dismiss();
      viewContainerFixture.detectChanges(); // allow animations to pass
      flush(); // allow async methods to complete

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
    }));

    it(
      'should dispatch a removeFeedbackAction and the userActions ' +
        'when the snackbar is dismissed with an action',
      fakeAsync(() => {
        store.dispatch(new AddEffectFeedback({ effectFeedback: mockFeedBack }));
        store.dispatch = jest.fn();

        snackbar._openedSnackBarRef.dismissWithAction();
        viewContainerFixture.detectChanges(); // allow animations to pass
        flush(); // allow async methods to complete

        const expectedAction = mockFeedBack.userActions[0].userAction;

        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      })
    );
  });

  describe('error feedback', () => {
    beforeAll(() => {
      mockFeedBack.type = 'error';
    });

    it('should pass the error feedback to the banner-stream', () => {
      store.dispatch(new AddEffectFeedback({ effectFeedback: mockFeedBack }));

      expect(service.bannerFeedback$).toBeObservable(
        hot('a', { a: mockFeedBack })
      );
    });
  });
});

/*
 * Code to set up portal host for snackbar
 * Copied from https://github.com/angular/material2/blob/master/src/lib/snack-bar/snack-bar.spec.ts
 * Modified to be shorter
 *
 * In essense: a component is created and rendered as an entryComponent, which is needed for
 * a componentFactory to exist at forRoot. This factory is needed to get a MatSnackbarContainer.
 * This container serves as a PortalHost for the MatSnackbar component.
 *
 * Simple component to open snack bars from.
 * Create a real (non-test) NgModule as a workaround forRoot
 * https://github.com/angular/angular/issues/10760
 */

// tslint:disable
@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'arbitrary-component',
  template: `
    <dir-with-view-container></dir-with-view-container>
  `
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer)
  childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

const TEST_DIRECTIVES = [
  ComponentWithChildViewContainer,
  DirectiveWithViewContainer
];
@NgModule({
  imports: [CommonModule, MatSnackBarModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ComponentWithChildViewContainer]
})
class SnackBarTestModule {}
