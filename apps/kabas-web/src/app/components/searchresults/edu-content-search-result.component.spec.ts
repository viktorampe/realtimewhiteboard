import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EduContentFixture } from '@campus/dal';
import {
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  EduContentSearchResultInterface
} from '@campus/shared';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { EduContentSearchResultComponent } from './edu-content-search-result.component';

describe('EduContentSearchResultComponent', () => {
  let component: EduContentSearchResultComponent;
  let fixture: ComponentFixture<EduContentSearchResultComponent>;
  let contentActionsServiceInterface: ContentActionsServiceInterface;
  const mockIsFavorite = new BehaviorSubject(false);
  let dateMock: MockDate;

  beforeAll(() => {
    dateMock = new MockDate();
  });
  afterAll(() => {
    dateMock.returnRealDate();
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EduContentSearchResultComponent],
      imports: [MatIconModule, UiModule, NoopAnimationsModule],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: CONTENT_ACTIONS_SERVICE_TOKEN,
          useValue: {
            getActionsForEduContent: () => {}
          }
        }
      ]
    });

    contentActionsServiceInterface = TestBed.get(CONTENT_ACTIONS_SERVICE_TOKEN);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchResultComponent);
    component = fixture.componentInstance;

    component.data = {
      eduContent: new EduContentFixture({ id: 1 })
    } as EduContentSearchResultInterface;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
