import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelAdaptableListComponent } from './adaptable-list.component';

describe('InfoPanelAdaptableListComponent', () => {
  let component: InfoPanelAdaptableListComponent;
  let fixture: ComponentFixture<InfoPanelAdaptableListComponent>;

  let mockData: {
    titleText: string;
    items: { text: string; count?: number; eventId?: number }[];
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelAdaptableListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelAdaptableListComponent);
    component = fixture.componentInstance;

    mockData = {
      titleText: 'title-text',
      items: [
        { text: 'item-one' },
        { text: 'item-two', count: 12 },
        { text: 'item-three', count: 12, eventId: 1 }
      ]
    };

    component.titleText = mockData.titleText;
    component.items = mockData.items;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the correct title text', () => {
    const title = fixture.debugElement.query(
      By.css('.info-panel__adaptable-list__title')
    ).nativeElement.textContent;
    expect(title).toBe(mockData.titleText);
  });
  it('should show the correct number of list items', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item')
    );
    expect(listItemCollection.length).toBe(3);
  });
  it('should show the correct number of list with counts', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__text__count')
    );
    expect(listItemCollection.length).toBe(2);
  });
  it('should show the correct number of list with icon', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__icon')
    );
    expect(listItemCollection.length).toBe(1);
  });
  it('should show the label for a list element', () => {
    const listItemText = fixture.debugElement.query(
      By.css('.info-panel__adaptable-list__items__item__text')
    ).nativeElement.textContent;
    expect(listItemText).toContain(mockData.items[0].text);
  });
  it('should show the count if there is one', () => {
    const listItemText = fixture.debugElement.query(
      By.css('.info-panel__adaptable-list__items__item__text__count')
    ).nativeElement.textContent;
    expect(listItemText).toContain('(' + mockData.items[1].count + ')');
  });
});
