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
import {
  DalActions,
  EffectFeedbackActions,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  EffectFeedbackReducer,
  getStoreModuleForFeatures,
  Priority
} from '@campus/dal';
import { Action, Store, StoreModule } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FeedBackService } from '.';
import {
  SnackBarDefaultConfig,
  SNACKBAR_DEFAULT_CONFIG_TOKEN
} from './snackbar.config';

// tslint:disable:no-use-before-declare
describe('FeedBackService', () => {
  let mockFeedBack: EffectFeedbackInterface;
  let service: FeedBackService;
  let defaultSnackbarConfig: MatSnackBarConfig;
  let feedback$: BehaviorSubject<EffectFeedbackInterface>;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeAll(() => {
    const mockAction = {
      title: 'klik',
      userAction: new DalActions.ActionSuccessful({ successfulAction: 'test' })
    };

    mockFeedBack = new EffectFeedbackFixture({
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [mockAction, mockAction],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH,
      useDefaultCancel: false
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

    service = TestBed.get(FeedBackService);

    viewContainerFixture = TestBed.createComponent(
      ComponentWithChildViewContainer
    );

    viewContainerFixture.detectChanges();
    testViewContainerRef =
      viewContainerFixture.componentInstance.childViewContainer;

    defaultSnackbarConfig = TestBed.get(SNACKBAR_DEFAULT_CONFIG_TOKEN);
    defaultSnackbarConfig.viewContainerRef = testViewContainerRef;

    feedback$ = new BehaviorSubject<EffectFeedbackInterface>(null);
    service.setupStreams(feedback$);
  });

  describe('creation', () => {
    it('should be created', inject(
      [FeedBackService],
      (srv: FeedBackService) => {
        expect(srv).toBeTruthy();
      }
    ));
  });

  describe('success feedback', () => {
    let snackbar: MatSnackBar;
    let removeFeedbackAction: Action;

    beforeAll(() => {
      removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
        id: mockFeedBack.id
      });
    });

    beforeEach(() => {
      snackbar = TestBed.get(MatSnackBar);
    });

    it('should call the feedbackService, without a userAction', () => {
      snackbar.open = jest.fn();
      const mockFeedBackWithoutActions = { ...mockFeedBack, userActions: null };

      // subscriber needed
      service.snackbarAfterDismiss$.pipe(take(1)).subscribe();

      feedback$.next(mockFeedBackWithoutActions);

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

      // subscriber needed
      service.snackbarAfterDismiss$.pipe(take(1)).subscribe();

      feedback$.next(mockFeedBack);

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

      // subscriber needed
      service.snackbarAfterDismiss$.pipe(take(1)).subscribe();

      feedback$.next(mockFeedBack);

      expect(snackbar.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        defaultSnackbarConfig
      );
    });

    it('should output the snackBar afterDismiss', fakeAsync(() => {
      const expectedAction = {
        dismissedWithAction: true,
        feedback: mockFeedBack
      };

      // subscriber needed
      service.snackbarAfterDismiss$.pipe(take(1)).subscribe(fb => {
        expect(fb).toEqual(expectedAction);
      });

      feedback$.next(mockFeedBack);

      snackbar._openedSnackBarRef.dismissWithAction();
      viewContainerFixture.detectChanges(); // allow animations to pass
      flush(); // allow async methods to complete
    }));
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
