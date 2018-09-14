import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AdaptableSelectComponent } from './adaptable-select.component';


describe('AdaptableSelectComponent', () => {
  let component: AdaptableSelectComponent;
  let fixture: ComponentFixture<AdaptableSelectComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptableSelectComponent],
      imports: [ReactiveFormsModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptableSelectComponent);
    component = fixture.componentInstance;

    mockData = {
      label: 'the-title',
      text: 'this is the text for the select',
      options: ['option-one', 'option-two']
    };
    mockData.selectedOption = mockData.options[0];

    component.label = mockData.label;
    component.text = mockData.text;
    component.selectedOption = mockData.selectedOption;
    component.options = mockData.options;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not show the save icon when no change was made', () => {
    const icon = fixture.debugElement.query(
      By.css('.campus-adaptable-select__dropdown__icon')
    );
    expect(icon).toBeFalsy();
  });
  it('should show the icon once a change was made to the select', () => {
    component.selectControl.markAsDirty();
    fixture.detectChanges();
    const icon = fixture.debugElement.query(
      By.css('.campus-adaptable-select__dropdown__icon')
    );
    expect(icon).toBeTruthy();
  });
  it('should show the label', () => {
    const label = fixture.debugElement.query(
      By.css('.campus-adaptable-select__label')
    ).nativeElement.textContent;
    expect(label).toBe(mockData.label);
  });
  it('should show the text', () => {
    const text = fixture.debugElement.query(
      By.css('.campus-adaptable-select__text')
    ).nativeElement.textContent;
    expect(text).toBe(mockData.text);
  });
  it('should hide the icon once it is clicked', () => {
    component.selectControl.markAsDirty();
    fixture.detectChanges();
    const icon = fixture.debugElement.query(
      By.css('.campus-adaptable-select__dropdown__icon')
    );
    icon.triggerEventHandler('click', null);
    fixture.detectChanges();
    const icon2 = fixture.debugElement.query(
      By.css('.campus-adaptable-select__dropdown__icon')
    );
    expect(icon2).toBeFalsy();
  });
  it('should emit the selected option', () => {
    component.selectControl.setValue(mockData.options[1]);
    component.selectControl.markAsDirty();
    fixture.detectChanges();
    let option: string;
    component.saveStatus.subscribe((e: string) => (option = e));
    const icon = fixture.debugElement.query(
      By.css('.campus-adaptable-select__dropdown__icon')
    );
    icon.triggerEventHandler('click', null);
    expect(option).toBe(mockData.options[1]);
  });
});
