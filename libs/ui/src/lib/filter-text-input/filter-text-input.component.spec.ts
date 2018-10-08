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

  const mockData = {
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
    component.setInput(mockData.text);
    fixture.detectChanges();
    const test = fixture.debugElement.query(
      By.css('.ui-filter-text-input__cancel')
    );
    expect(test).toBeTruthy();
  });

  xit('should hide clear button -> hidden with css, not removed from DOM', () => {
    component.setInput('aa');
    fixture.detectChanges();
    component.setInput('');
    fixture.detectChanges();
    const test = fixture.debugElement.query(
      By.css('.ui-filter-text-input__cancel')
    );
    expect(test).toBeFalsy();
  });

  it('clicking clear button should clear the input field', () => {
    const text = '';
    component.setInput(mockData.text);
    fixture.detectChanges();
    const test = fixture.debugElement.query(
      By.css('.ui-filter-text-input__cancel')
    );
    test.triggerEventHandler('click', null);
    expect(text).toBe('');
  });
});
