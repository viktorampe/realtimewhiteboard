import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FilterTextInputComponent } from './filter-text-input.component';

describe('FilterTextInputComponent', () => {
  let component: FilterTextInputComponent;
  let fixture: ComponentFixture<FilterTextInputComponent>;

  const mockData = {
    placeHolder: 'foo',
    text: 'bar'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTextInputComponent],
      imports: [FormsModule, ReactiveFormsModule]
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
    component.filterTextChange.subscribe((e: string) => (text = e));
    component.filterText = mockData.text;
    fixture.detectChanges();
    expect(text).toEqual(mockData.text);
    const input = fixture.debugElement.query(
      By.css('.ui-filter-text-input__input')
    ).nativeElement;
    expect(input.value).toEqual(mockData.text);
  });

  it('should show clear button (displayed with css)', () => {
    component.filterText = mockData.text;
    fixture.detectChanges();
    const inputNotEmpty = fixture.debugElement.query(
      By.css('.ui-filter-text-input__input--not-empty')
    );
    expect(inputNotEmpty).toBeTruthy();
  });

  it('should hide clear button (hidden with css)', () => {
    component.filterText = mockData.text;
    fixture.detectChanges();
    component.filterText = '';
    fixture.detectChanges();
    const inputNotEmpty = fixture.debugElement.query(
      By.css('.ui-filter-text-input__input--not-empty')
    );
    expect(inputNotEmpty).toBeNull();
  });

  it('clicking clear button should clear the input field', () => {
    let text: string;
    component.filterTextChange.subscribe((e: string) => (text = e));
    component.filterText = mockData.text;
    fixture.detectChanges();
    expect(text).toBe(mockData.text);
    const cancel = fixture.debugElement.query(
      By.css('.ui-filter-text-input__cancel')
    );
    cancel.triggerEventHandler('click', null);
    expect(text).toBe('');
  });
});
