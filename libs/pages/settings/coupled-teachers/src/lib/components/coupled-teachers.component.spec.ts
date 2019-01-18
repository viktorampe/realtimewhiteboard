import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LearningAreaFixture, PersonFixture } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';
import { MockCoupledTeachersViewModel } from '../coupled-teachers.viewmodel.mock';
import { PagesSettingsCoupledTeachersRoutingModule } from '../pages-settings-coupled-teachers-routing.module';
import { CoupledTeachersComponent } from './coupled-teachers.component';

describe('CoupledTeachersComponent', () => {
  let component: CoupledTeachersComponent;
  let fixture: ComponentFixture<CoupledTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule,
        ReactiveFormsModule,
        UiModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatInputModule,
        PagesSettingsCoupledTeachersRoutingModule
      ],
      declarations: [CoupledTeachersComponent],
      providers: [
        {
          provide: CoupledTeachersViewModel,
          useValue: MockCoupledTeachersViewModel
        },
        {
          provide: PersonAlreadyLinkedValidator,
          useClass: PersonAlreadyLinkedValidator
        },
        {
          provide: FormBuilder,
          useClass: FormBuilder
        },
        {
          provide: Store,
          useClass: StoreModule
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupledTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return date correct string', () => {
    expect(component.getDateString(new PersonFixture())).toBe('');
    const person = new PersonFixture({ linkedAt: new Date(1541192290150) });
    expect(component.getDateString(person)).toBe('2-11-18 21:58:10');
  });

  it('should return areas string', () => {
    const learningAreas = [
      new LearningAreaFixture(),
      new LearningAreaFixture()
    ];

    expect(component.getFavoriteAreasString(new PersonFixture())).toBe('');
    const person = new PersonFixture({ favoriteAreas: learningAreas });
    expect(component.getFavoriteAreasString(person)).toBe('foo, foo');
  });
});
