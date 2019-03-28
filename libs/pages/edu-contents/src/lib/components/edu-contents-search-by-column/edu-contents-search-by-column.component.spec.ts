import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EDU_CONTENT_SERVICE_TOKEN } from '@campus/dal';
import { SearchModeInterface, SearchModule } from '@campus/search';
import {
  EnvironmentIconMappingInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { Observable } from 'rxjs';
import { EduContentSearchByColumnComponent } from './edu-contents-search-by-column.component';

export class IconMapping implements EnvironmentIconMappingInterface {
  [icon: string]: string;
}

export class SearchModeMapping implements EnvironmentSearchModesInterface {
  [mode: string]: SearchModeInterface;
}

describe('EduContentSearchByColumnComponent', () => {
  let component: EduContentSearchByColumnComponent;
  let fixture: ComponentFixture<EduContentSearchByColumnComponent>;
  let actions: Observable<any>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        SearchModule,
        SharedModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useClass: IconMapping
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useClass: SearchModeMapping
        },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {}
        }
      ],
      declarations: [EduContentSearchByColumnComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
