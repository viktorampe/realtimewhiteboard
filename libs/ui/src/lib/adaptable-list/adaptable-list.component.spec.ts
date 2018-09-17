import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdaptableListComponent } from './adaptable-list.component';

describe('AdaptableListComponent', () => {
  let component: AdaptableListComponent;
  let fixture: ComponentFixture<AdaptableListComponent>;

  let mockData: {
    titleText: string;
    items: { text: string; count?: number; eventId?: number }[];
    showIcon: boolean;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptableListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptableListComponent);
    component = fixture.componentInstance;

    mockData = {
      titleText: 'title-text',
      items: [
        { text: 'item-one' },
        { text: 'item-two', count: 12 },
        { text: 'item-three', count: 44, eventId: 4 }
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
      By.css('.campus_adaptable-list__title')
    ).nativeElement.textContent;
    expect(title).toBe(mockData.titleText);
  });
  it('should show the correct number of list items', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.campus_adaptable-list__items__item')
    );
    expect(listItemCollection.length).toBe(3);
  });
  it('should show the correct number of list items with counts', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.campus_adaptable-list__items__item__text__count')
    );
    expect(listItemCollection.length).toBe(2);
  });
  it('should show the correct number of list items with icon', () => {
    const listItemCollection = fixture.debugElement.queryAll(
      By.css('.campus_adaptable-list__items__item__icon')
    );
    expect(listItemCollection.length).toBe(1);
  });
  it('should show the correct labels for the items', () => {
    const listItems = fixture.debugElement.queryAll(
      By.css('.campus_adaptable-list__items__item__text')
    );
    for (let i = 0; i < listItems.length; i++) {
      const elementText = listItems[i].nativeElement.textContent;
      expect(elementText).toContain(mockData.items[i].text);
    }
  });
  it('should show the count if there is one', () => {
    const listItemCounts = fixture.debugElement.queryAll(
      By.css('.campus_adaptable-list__items__item__text__count')
    );
    for (let i = 0; i < listItemCounts.length; i++) {
      const countElement = listItemCounts[i].nativeElement.textContent;
      expect(countElement).toBe('(' + mockData.items[i + 1].count + ')');
    }
  });
  it('should show the icon', () => {
    const icon = fixture.debugElement.query(
      By.css('.campus_adaptable-list__icon-holder__icon')
    );
    expect(icon).toBeTruthy();
  });
  it('should not show the icon if boolean is false', () => {
    component.showIcon = false;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(
      By.css('.campus_adaptable-list__icon-holder__icon')
    );
    expect(icon).toBeFalsy();
  });
  it('should trigger icon event when icon is clicked', () => {
    let clicked: boolean;
    component.iconClicked.subscribe((e: boolean) => (clicked = e));
    fixture.debugElement
      .query(By.css('.campus_adaptable-list__icon-holder__icon'))
      .triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(clicked).toBe(true);
  });
  it('should trigger itemIcon event when one is clicked', () => {
    let eventId: number;
    component.itemIconClicked.subscribe((e: number) => (eventId = e));
    fixture.debugElement
      .query(By.css('.campus_adaptable-list__items__item__icon'))
      .triggerEventHandler('click', null);
    expect(eventId).toBe(mockData.items[2].eventId);
  });
});
