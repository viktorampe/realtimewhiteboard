import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FilterTextInputComponent } from './filter-text-input.component';

describe('FilterTextInputComponent', () => {
  let component: FilterTextInputComponent;
  let fixture: ComponentFixture<FilterTextInputComponent>;

  let mockData = {
    placeHolder: 'brol',
    text: 'briel'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTextInputComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        LayoutModule,
        MatIconModule,
        RouterModule,
        MatSelectModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change placeholder text', () => {
    component.setPlaceHolder(mockData.placeHolder);
    expect(component.getPlaceHolder()).toEqual(mockData.placeHolder);
  });

  it('should change input value text', () => {
    component.getInput().subscribe((data: string) => {
      expect(data).toBe(mockData.text);
    });
    component.setInput(mockData.text);
  });

  it('should change clear button visibility', () => {
    component.getInput().subscribe((data: string) => {
      console.log(component.isClearButtonVisible());
      expect(component.isClearButtonVisible()).toBeTruthy();
    });
    component.setInput(mockData.text);
  });
});
