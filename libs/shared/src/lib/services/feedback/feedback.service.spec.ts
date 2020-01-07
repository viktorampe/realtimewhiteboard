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
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  Priority
} from '@campus/dal';
import { hot } from 'jasmine-marbles';
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
        MatSnackBarModule,
        SnackBarTestModule // -> see end of file for details
      ],
      providers: [
        MatSnackBar,
        {
          provide: SNACKBAR_DEFAULT_CONFIG_TOKEN,
          useClass: SnackBarDefaultConfig
        }
      ]
    });

    service = TestBed.get(FeedBackService);

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
      [FeedBackService],
      (srv: FeedBackService) => {
        expect(srv).toBeTruthy();
      }
    ));
  });

  describe('success feedback', () => {
    let snackbar: MatSnackBar;

    beforeEach(() => {
      snackbar = TestBed.get(MatSnackBar);
    });

    it('should call the snackbarService, without a userAction', () => {
      snackbar.open = jest.fn();
      const mockFeedBackWithoutActions = { ...mockFeedBack, userActions: null };

      service.openSnackbar(mockFeedBackWithoutActions);

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

      service.openSnackbar(mockFeedBack);

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

      service.openSnackbar(mockFeedBack);

      expect(snackbar.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        defaultSnackbarConfig
      );
    });

    it('should output the snackBar afterDismiss', fakeAsync(() => {
      const expected = {
        actionToDispatch: mockFeedBack.userActions[0].userAction,
        feedback: mockFeedBack
      };

      const mockSnackbarRef = snackbar.open('foo');

      const result = service.snackbarAfterDismiss({
        snackbarRef: mockSnackbarRef,
        feedback: mockFeedBack
      });

      result.subscribe(res => expect(res).toEqual(expected));

      mockSnackbarRef.dismissWithAction();

      viewContainerFixture.detectChanges(); // allow ui-element to close
      flush(); // let subscriptions run and complete

      // there is a stream, it has already completed -> check expect in sub
      expect(result).toBeObservable(hot('|'));
    }));

    it('should pass add a cancel userAction when needed', () => {
      mockFeedBack.useDefaultCancel = true;

      const cancelBannerAction = { title: 'Annuleren', userAction: null };

      // add the cancel button
      const expectedFeedback = {
        ...mockFeedBack,
        ...{ userActions: [...mockFeedBack.userActions, cancelBannerAction] }
      };

      const result = service.addDefaultCancelButton(mockFeedBack);

      expect(result).toEqual(expectedFeedback);
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
  @ViewChild(DirectiveWithViewContainer, { static: false })
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
