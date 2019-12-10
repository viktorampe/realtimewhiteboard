import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatListModule,
  MatTabsModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { PagesKabasTasksModule } from '../../pages-kabas-tasks.module';
import { ManageKabasTasksOverviewComponent } from './manage-kabas-tasks-overview.component';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PagesKabasTasksModule,
        NoopAnimationsModule,
        MatListModule,
        MatTabsModule,
        MatIconModule,
        UiModule,
        SharedModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
