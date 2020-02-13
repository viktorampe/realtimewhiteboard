import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconRegistry,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { CardImageComponent } from '../card-image/card-image.component';
import { CardTextComponent } from '../card-text/card-text.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
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
        MatProgressBarModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        CardTextComponent,
        CardImageComponent,
        ImageToolbarComponent,
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
    component.viewModeImage = false;
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.card__content__errorMessage')
    );
    expect(errorMessage).not.toBeNull();
  });

  it('should show errormessage when no text is provided', () => {
    component.description = '';
    component.txtContent.markAsDirty();
    component.viewModeImage = false;

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(
      By.css('[data-cy="errorMissingContent"]')
    );
    expect(errorMessage).not.toBeNull();
  });

  it('should show the card content when not editing', () => {
    component.description = 'Test content';
    component.isInputSelected = false;
    component.viewModeImage = false;
    fixture.detectChanges();
    const contentParagraph = fixture.debugElement.query(By.css('p'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  it('should display the card content in the input when editing', async () => {
    component.description = 'Test content';
    component.isInputSelected = true;
    component.viewModeImage = false;

    fixture.detectChanges();
    await fixture.whenStable();
    const inputContent = fixture.debugElement.query(
      By.css('.card__content__input__text')
    );
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
    component.toolbarsVisible = false;
    component.description = 'something that is not null';

    const myCard = fixture.debugElement.query(By.css('.card__content'));
    myCard.nativeElement.dispatchEvent(new MouseEvent('dblclick')); // use nativeElement so target is set
    fixture.detectChanges();

    expect(component.toolbarsVisible).toBe(true);
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

  it('should close the colorlist when a color is clicked', () => {
    component.toolbarsVisible = true;
    fixture.detectChanges();
    component.selectColor('white');
    fixture.detectChanges();
    expect(component.toolbarsVisible).toBe(false);
  });

  it('should change the cardcolor when a color is picked', () => {
    component.toolbarsVisible = true;
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
      By.css('.card__header__checkbox')
    );
    const checkbox = checkboxes[0].nativeElement;
    checkbox.click(); // van false naar true
    fixture.detectChanges();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should emit the right card when a card is deselected', () => {
    spyOn(component.deselect, 'emit');
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.card__header__checkbox')
    );
    const checkbox = checkboxes[0].nativeElement;
    checkbox.click(); // van false naar true
    fixture.detectChanges();
    checkbox.click(); // van true naar false
    fixture.detectChanges();
    expect(component.deselect.emit).toHaveBeenCalled();
  });

  it('should show tools when showToolbar is toggled to true', () => {
    component.toolbarsVisible = false;
    component.toggleToolbar();
    const tools = fixture.debugElement.queryAll(By.css('.toolbar'));
    expect(tools).not.toBeNull();
  });
});
