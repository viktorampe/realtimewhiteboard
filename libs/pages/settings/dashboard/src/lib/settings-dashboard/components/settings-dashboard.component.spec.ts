import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDivider,
  MatIconRegistry,
  MatListItem,
  MatListModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonFixture, PersonInterface, RoleFixture } from '@campus/dal';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { ButtonComponent, UiModule } from '@campus/ui';
import { PersonBadgeComponent } from 'libs/ui/src/lib/person-badge/person-badge.component';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { SettingsDashboardComponent } from './settings-dashboard.component';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';
import { MockSettingsDashboardViewModel } from './settings-dashboard.viewmodel.mock';

describe('SettingsDashboardComponent', () => {
  let component: SettingsDashboardComponent;
  let fixture: ComponentFixture<SettingsDashboardComponent>;
  let viewModel: SettingsDashboardViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDashboardComponent],
      imports: [UiModule, MatListModule, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        {
          provide: SettingsDashboardViewModel,
          useClass: MockSettingsDashboardViewModel
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    viewModel = TestBed.get(SettingsDashboardViewModel);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of links', () => {
    const buttons = fixture.debugElement.queryAll(By.css('campus-button'));
    expect(buttons.length).toBe(5);
  });

  it('navitem should be populated with the correct name', () => {
    const buttons = fixture.debugElement.queryAll(By.css('campus-button'));
    expect(buttons[0].nativeElement.textContent).toContain('Mijn gegevens');
  });

  describe('avatar', () => {
    it('should show the user info', () => {
      const viewModelUser$ = viewModel.user$ as BehaviorSubject<
        PersonInterface
      >;
      const user: PersonInterface = new PersonFixture({
        avatar: 'blah',
        roles: [new RoleFixture(), new RoleFixture({ name: 'teacher' })]
      });

      viewModelUser$.next(user);
      fixture.detectChanges();

      const personBadge = fixture.debugElement.query(By.css('.ui_person-badge'))
        .componentInstance as PersonBadgeComponent;

      expect(personBadge.person).toEqual({
        displayName: user.displayName,
        name: user.name,
        firstName: user.firstName,
        avatar: user.avatar
      });

      expect(personBadge.subText).toEqual('Leerling - Leerkracht');
    });
  });

  describe('links', () => {
    describe('polpo', () => {
      beforeEach(() => {
        viewModel.environmentUi.useNavItemStyle = false;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should use the correct template for the list items', () => {
        let matList = fixture.debugElement.query(
          By.css('.pages-settings-dashboard__mat-list')
        );
        const buttonChildren = matList.queryAll(By.directive(ButtonComponent));

        expect(matList.children.length).toBe(buttonChildren.length);
      });

      describe('kabas', () => {
        beforeEach(() => {
          viewModel.environmentUi.useNavItemStyle = true;
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should use the correct template for the list items', () => {
          console.log(component.useNavItemStyle);

          const matList = fixture.debugElement.query(
            By.css('.pages-settings-dashboard__mat-list')
          );

          const dividerChildren = matList.queryAll(By.directive(MatDivider));
          const listItemChildren = matList.queryAll(By.directive(MatListItem));

          expect(matList.children.length).toBe(
            dividerChildren.length + listItemChildren.length
          );
          expect(dividerChildren.length).toBe(listItemChildren.length + 1);
        });
      });
    });
  });
});
