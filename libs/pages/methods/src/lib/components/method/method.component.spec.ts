import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCard,
  MatCardModule,
  MatIconModule,
  MatListItem,
  MatListModule,
  MatTabsModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';
import { MockMethodViewModel } from '../method.viewmodel.mock';
import { MethodComponent } from './method.component';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let methodViewModel: MethodViewModel;
  let params: BehaviorSubject<Params>;

  configureTestSuite(() => {
    params = new BehaviorSubject<Params>({ book: 1 });
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        UiModule
      ],
      declarations: [MethodComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params } },
        { provide: MethodViewModel, useClass: MockMethodViewModel }
      ]
    }).compileComponents();

    methodViewModel = TestBed.get(MethodViewModel);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the chapter links', () => {
    const chapters = fixture.debugElement.queryAll(By.directive(MatListItem));
    expect(chapters.length).toBe(4);
  });

  it('should show the method info card', () => {
    const methodCard = fixture.debugElement.query(By.directive(MatCard));
    expect(methodCard).toBeDefined();
  });

  it('should show the general files', () => {
    const generalFiles = fixture.debugElement.queryAll(
      By.css('.method-method__container__file')
    );
    expect(generalFiles.length).toBe(3);

    const productTypeHeaders = fixture.debugElement.queryAll(
      By.css('div[main] h3[mat-subheader]')
    );
    expect(productTypeHeaders.length).toBe(2);
  });
});
