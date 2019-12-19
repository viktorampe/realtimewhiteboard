import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PersonFixture, UserReducer } from '@campus/dal';
import { StoreModule } from '@ngrx/store';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '../interfaces';
import { SharedModule } from '../shared.module';
import { PermissionService } from './permission.service';
import { PERMISSION_SERVICE_TOKEN } from './permission.service.interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div *hasPermission="'permission-a'">string A</div>
    <div *hasPermission="'permission-b'">string B</div>
    <div *hasPermission="['permission-a', 'permission-x']">array A + X</div>
    <div *hasPermission="['permission-b', 'permission-x']">array B + X</div>
    <div *hasPermission="[['permission-a', 'permission-b'], 'permission-x']">
      array A or B + X
    </div>
    <div *hasPermission="[['permission-a', 'permission-b']]">array A or B</div>
    <div *hasPermission="['permission-x']">array X</div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, SharedModule],
  exports: [TestContainerComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class TestModule {}

describe('HasPermissionDirective', () => {
  let component: Component;
  let fixture: ComponentFixture<TestContainerComponent>;
  let testPermissions: string[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        StoreModule.forFeature('user', UserReducer.reducer, {
          initialState: {
            currentUser: new PersonFixture(),
            loaded: true,
            permissions: testPermissions,
            permissionsLoaded: true
          }
        })
      ],
      providers: [
        { provide: PERMISSION_SERVICE_TOKEN, useClass: PermissionService },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('without permissions', () => {
    beforeAll(() => {
      testPermissions = [];
    });

    it('should have no elements', async(() => {
      selectVisibleElements().then(listDE => {
        expect(listDE.length).toBe(0);
      });
    }));
  });

  describe('with single permission', () => {
    beforeAll(() => {
      testPermissions = ['permission-a'];
    });

    it('should show elements with single permission', async(() => {
      selectVisibleElements().then(listDE => {
        expect(listDE.length).toBe(2);
        expect(listDE[0].nativeElement.textContent).toBe('string A');
        expect(listDE[1].nativeElement.textContent).toBe('array A or B');
      });
    }));
  });

  describe('with multiple permissions', () => {
    beforeAll(() => {
      testPermissions = ['permission-a', 'permission-b'];
    });

    it('should show elements with permission', async(() => {
      selectVisibleElements().then(listDE => {
        expect(listDE.length).toBe(3);
        expect(listDE[0].nativeElement.textContent).toBe('string A');
        expect(listDE[1].nativeElement.textContent).toBe('string B');
        expect(listDE[2].nativeElement.textContent).toBe('array A or B');
      });
    }));
  });

  describe('with partially matching permissions', () => {
    beforeAll(() => {
      testPermissions = ['permission-a', 'permission-x'];
    });

    it('should show elements with permission', async(() => {
      selectVisibleElements().then(listDE => {
        expect(listDE.length).toBe(5);
        expect(listDE[0].nativeElement.textContent).toBe('string A');
        expect(listDE[1].nativeElement.textContent).toBe('array A + X');
        expect(listDE[2].nativeElement.textContent).toBe(' array A or B + X ');
        expect(listDE[3].nativeElement.textContent).toBe('array A or B');
        expect(listDE[4].nativeElement.textContent).toBe('array X');
      });
    }));
  });

  /**
   * Select the visible nodes
   *
   * @returns {Promise<DebugElement[]>}
   */
  function selectVisibleElements(): Promise<DebugElement[]> {
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      const listDE = fixture.debugElement.queryAll(By.css('div'));
      return listDE;
    });
  }
});
