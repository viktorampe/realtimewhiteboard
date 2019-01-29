import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';
import { MockCoupledTeachersViewModel } from '../coupled-teachers.viewmodel.mock';
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
        RouterTestingModule
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

  //todo add tests
});
