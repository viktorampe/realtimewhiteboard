import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelAdaptableListComponent } from './adaptable-list.component';

describe('InfoPanelAdaptableListComponent', () => {
  let component: InfoPanelAdaptableListComponent;
  let fixture: ComponentFixture<InfoPanelAdaptableListComponent>;

  let mockData: {
    titleText: string;
    items: { text: string; count?: number; eventId?: number }[];
    showIcon: boolean;
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
        { text: 'item-three', count: 44, eventId: 1 }
      ],
      showIcon: true
    };

    component.titleText = mockData.titleText;
    component.items = mockData.items;
    component.showIcon = mockData.showIcon;

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
  it('should show the correct number of list items with counts', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__text__count')
    );
    expect(listItemCollection.length).toBe(2);
  });
  it('should show the correct number of list items with icon', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__icon')
    );
    expect(listItemCollection.length).toBe(1);
  });
  it('should show the correct labels for the items', () => {
    const listItems = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__text')
    );
    for (let i = 0; i < listItems.length; i++) {
      const elementText = listItems[i].nativeElement.textContent;
      expect(elementText).toContain(mockData.items[i].text);
    }
  });
  it('should show the count if there is one', () => {
    const listItemCounts = fixture.debugElement.queryAll(
      By.css('.info-panel__adaptable-list__items__item__text__count')
    );
    for (let i = 0; i < listItemCounts.length; i++) {
      const countElement = listItemCounts[i].nativeElement.textContent;
      expect(countElement).toBe('(' + mockData.items[i + 1].count + ')');
    }
  });
  it('should show the icon', () => {
    const icon = fixture.debugElement.query(
      By.css('.info-panel__adaptable-list__icon-holder__icon')
    );
    expect(icon).toBeTruthy();
  });
  it('should not show the icon if boolean is false', () => {
    component.showIcon = false;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(
      By.css('.info-panel__adaptable-list__icon-holder__icon')
    );
    expect(icon).toBeFalsy();
  });
});
