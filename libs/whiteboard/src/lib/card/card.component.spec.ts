import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconRegistry,
  MatProgressBarModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatProgressBarModule
      ],
      declarations: [
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        ProgressBarComponent
      ],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    const mockData = {
      color: 'white',
      description: '',
      image: null,
      isInputSelected: true,
      editMode: true,
      top: 0,
      left: 0
    };

    component.color = mockData.color;
    component.description = mockData.description;
    component.image = mockData.image;
    component.isInputSelected = mockData.isInputSelected;
    component.editMode = mockData.editMode;
    component.top = mockData.top;
    component.left = mockData.left;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle input where input is valid', () => {
    component.description = 'valid';
    component.toggleInput();
    expect(component.isInputSelected).toBe(false);
  });

  it('should toggle input where input is empty', () => {
    component.description = '';
    component.toggleInput();
    expect(component.isInputSelected).toBe(true);
  });

  it('should show errormessage when input is maximal', () => {
    component.description = 'a'.repeat(component.maxCharacters);
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.card__innercard__content__errorMessage')
    );
    expect(errorMessage).not.toBeNull();
  });

  it('should show errormessage when no text is provided', () => {
    component.description = '';
    component.txtContent.markAsDirty();

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(
      By.css('[data-cy="errorMissingContent"]')
    );
    expect(errorMessage).not.toBeNull();
  });

  it('should show the card content when not editing', () => {
    component.description = 'Test content';
    component.isInputSelected = false;
    fixture.detectChanges();
    const contentParagraph = fixture.debugElement.query(By.css('p'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  it('should display the card content in the input when editing', async () => {
    component.description = 'Test content';
    component.isInputSelected = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const inputContent = fixture.debugElement.query(By.css('textarea'));
    expect(inputContent.nativeElement.value.trim()).toBe('Test content');
  });

  it('should create card with description empty', () => {
    expect(component.description).toBe('');
  });

  it('should set the correct top style on creation', () => {
    component.top = 500;

    component.ngOnChanges();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.style.top).toBe('500px');
  });

  it('should set the correct left style on creation', () => {
    component.left = 500;

    component.ngOnChanges();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.style.left).toBe('500px');
  });

  it('should toggle to edit mode when double click.', () => {
    component.editMode = false;
    component.description = 'something that is not null';

    const myCard = fixture.debugElement.query(
      By.css('.card__innercard__content')
    );
    myCard.nativeElement.dispatchEvent(new MouseEvent('dblclick')); // use nativeElement so target is set
    fixture.detectChanges();

    expect(component.editMode).toBe(true);
  });

  it('should toggle edit mode when the editicon is clicked', () => {
    component.editMode = false;
    component.toggleEditMode();
    fixture.detectChanges();
    expect(component.editMode).toBe(true);
  });

  it('should toggle to view mode image when toggle icon is clicked', () => {
    component.viewModeImage = false;
    component.toggleView();
    fixture.detectChanges();
    expect(component.viewModeImage).toBe(true);
  });

  it('should show the colorlist when the coloricon is clicked', () => {
    component.showColor();
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(false);
  });

  it('should hide the colorlist when the coloricon is clicked twice', () => {
    component.showColor();
    fixture.detectChanges();
    component.showColor();
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(true);
  });

  it('should close the colorlist when a color is clicked', () => {
    component.showColor();
    fixture.detectChanges();
    component.selectColor('white');
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(true);
  });

  it('should change the cardcolor when a color is picked', () => {
    component.showColor();
    fixture.detectChanges();
    component.selectColor('black');
    fixture.detectChanges();
    expect(component.color).toBe('black');
  });

  it('should emit the right color when a cardcolor is picked', () => {
    spyOn(component.lastColor, 'emit');
    component.selectColor('black');
    expect(component.lastColor.emit).toHaveBeenCalledWith('black');
  });

  it('should emit deleteCard when the close button is clicked', () => {
    spyOn(component.deleteCard, 'emit');
    component.onDeleteCard();
    expect(component.deleteCard.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit the right card when a card is selected', () => {
    spyOn(component.select, 'emit');
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.card__innercard__header__checkbox')
    );
    const checkbox = checkboxes[0].nativeElement;
    checkbox.click(); // van false naar true
    fixture.detectChanges();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should emit the right card when a card is deselected', () => {
    spyOn(component.deselect, 'emit');
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.card__innercard__header__checkbox')
    );
    const checkbox = checkboxes[0].nativeElement;
    checkbox.click(); // van false naar true
    fixture.detectChanges();
    checkbox.click(); // van true naar false
    fixture.detectChanges();
    expect(component.deselect.emit).toHaveBeenCalled();
  });

  it('should remove image when removeImage() is called', () => {
    component.image = 'this is not an empty string';
    component.removeImage();
    expect(component.image).toBe('');
  });

  it('should remove background-image when removeImage() is called', () => {
    component.image = 'this is not null';
    component.removeImage();
    fixture.detectChanges();
    const innercard__image = fixture.debugElement.query(
      By.css('.card__innercard__content__image')
    ).nativeElement;
    expect(innercard__image.style.backgroundImage).toBe('url()');
  });

  it('should replace image when replaceImage() is called', () => {
    component.image = 'image_1';
    component.replaceImage('image_2');
    expect(component.image).toBe('image_2');
  });

  it('should replace background-image when replaceImage() is called', () => {
    component.image = 'image_1';
    component.replaceImage('image_2');
    fixture.detectChanges();
    const innercard__image = fixture.debugElement.query(
      By.css('.card__innercard__content__image')
    ).nativeElement;
    expect(innercard__image.style.backgroundImage).toBe('url(image_2)');
  });

  it('should close the open colorlist when switching out of editmode', () => {
    component.showColor();
    component.toggleEditMode();
    expect(component.colorlistHidden).toBe(true);
  });
});
