import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
        MatFormFieldModule,
        MatInputModule,
        LayoutModule,
        MatIconModule,
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

  it('should change input value text', () => {
    let text: string;
    component.text.subscribe((e: string) => (text = e));
    component.setInput(mockData.text);
    expect(text).toEqual(mockData.text);
  });

  it('should show clear button', () => {
    let text: string;
    component.setInput(mockData.text);
    fixture.detectChanges();
    let test = fixture.debugElement.query(By.css('button'));
    expect(test).toBeTruthy();
  });

  it('should hide clear button', () => {
    let text: string;
    component.setInput('aa');
    fixture.detectChanges();
    component.setInput('');
    fixture.detectChanges();
    let test = fixture.debugElement.query(By.css('button'));
    expect(test).toBeFalsy();
  });

  it('clicking clear button should clear the input field', () => {
    let text: string = '';
    component.setInput(mockData.text);
    component.text.subscribe((e: string) => {
      console.log(e);
    });
    fixture.detectChanges();
    let test = fixture.debugElement.query(By.css('button'));
    test.triggerEventHandler('click', null);
    expect(text).toBe('');
  });
});
