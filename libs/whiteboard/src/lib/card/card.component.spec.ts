import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CardimageComponent } from '../cardimage/cardimage.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, FormsModule, MatIconModule],
      declarations: [
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        CardimageComponent
      ],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the card content when not editing', () => {
    component.card.cardContent = 'Test content';
    component.card.isInputSelected = false;
    fixture.detectChanges();
    const contentParagraph = fixture.debugElement.query(By.css('p'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  it('should display the card content in the input when editing', async () => {
    component.card.cardContent = 'Test content';
    component.card.isInputSelected = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const inputContent = fixture.debugElement.query(By.css('textarea'));
    expect(inputContent.nativeElement.value.trim()).toBe('Test content');
  });

  it('should hide image when view mode image is false', () => {
    component.viewModeImage = true;
    component.toggleView();
    fixture.detectChanges();
    const cardImageComponent = fixture.debugElement.query(
      By.css('campus-cardimage')
    );
    expect(cardImageComponent.nativeElement.getAttribute('hidden')).toBe('');
  });

  it('should show image when view mode image is true', () => {
    component.viewModeImage = false;
    component.toggleView();
    fixture.detectChanges();
    const cardImageComponent = fixture.debugElement.query(
      By.css('campus-cardimage')
    );
    expect(cardImageComponent.nativeElement.getAttribute('hidden')).toBe(null);
  });

  it('should hide toggle icon in editmode', () => {
    component.card.editMode = false;
    component.toggleEditMode();

    fixture.detectChanges();

    const toggleicon = fixture.debugElement.query(By.css('#toggle_icon'));

    expect(toggleicon).toBe(null);
  });

  it('should show toggle icon when not in editmode', () => {
    component.card.editMode = true;
    component.toggleEditMode();

    fixture.detectChanges();

    const toggleicon = fixture.debugElement.query(By.css('#toggle_icon'));

    expect(toggleicon).not.toBe(null);
  });

  it('should toggle to edit mode when double click.', () => {
    component.card.editMode = false;
    component.card.cardContent = 'something that is not null';

    const myCard = fixture.debugElement.query(By.css('.card'));
    myCard.nativeElement.dispatchEvent(new MouseEvent('dblclick')); // use nativeElement so target is set
    fixture.detectChanges();

    expect(component.card.editMode).toBe(true);
  });

  it('should toggle edit mode when the editicon is clicked', () => {
    component.card.editMode = false;
    component.toggleEditMode();
    fixture.detectChanges();
    expect(component.card.editMode).toBe(true);
  });

  it('should toggle to view mode image when toggel icon is clicked', () => {
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
    expect(component.card.color).toBe('black');
  });
});
