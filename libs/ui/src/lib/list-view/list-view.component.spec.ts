import { ListItemDirective } from './list-item/list-item.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewComponent } from './list-view.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
  <campus-list-view>
  <div campusListItem>test1</div>
  <div campusListItem>test2</div>
  <div campusListItem>test3</div>
  <div campusListItem>test4</div>
  <div campusListItem><img src="https://www.polpo.be/assets/images/polpo.svg"></div>
  <div campusListItem><img src="https://www.polpo.be/assets/images/home-laptop-books.jpg"></div>
  </campus-list-view>
`
})
export class ListViewHostComponent {}

@Component({
  template: `
  <campus-list-view>
  </campus-list-view>
`
})
export class EmptyListViewHostComponent {}

describe('ListViewComponent', () => {
  let hostComponent: ListViewHostComponent;
  let hostFixture: ComponentFixture<ListViewHostComponent>;
  let componentDE: DebugElement;
  let component: ListViewComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListViewComponent,
        ListViewHostComponent,
        EmptyListViewHostComponent,
        ListItemDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(ListViewHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    componentDE = hostFixture.debugElement.query(By.css('campus-list-view'));
    component = <ListViewComponent>componentDE.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find projected content as children', () => {
    expect(component.itemsAmount).toBe(6);
  });

  it('should show the text placeholder if without content', () => {
    hostFixture = TestBed.createComponent(EmptyListViewHostComponent);
    hostComponent = hostFixture.componentInstance;

    component = <ListViewComponent>(
      hostFixture.debugElement.query(By.css('campus-list-view'))
        .componentInstance
    );
    hostFixture.detectChanges();

    componentDE = hostFixture.debugElement.query(By.css('campus-list-view'));

    expect(componentDE.nativeElement.textContent).toContain(
      component.placeHolderText
    );
  });

  it('should apply the flex-grid class', () => {
    component.setListFormat('grid');
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));

    expect(itemListDE.nativeElement.className).toContain('flex-grid');
    expect(itemListDE.nativeElement.className).not.toContain('flex-list');
  });

  it('should apply the flex-list class', () => {
    component.setListFormat('list');
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));

    expect(itemListDE.nativeElement.className).toContain('flex-list');
    expect(itemListDE.nativeElement.className).not.toContain('flex-grid');
  });

  it('should select only 1 item', () => {
    component.multiSelect = false;
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(1);
  });

  it('should select multiple items', () => {
    component.multiSelect = true;
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(2);
  });

  it('should deselect an item', () => {
    component.multiSelect = true;
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();
    childComponent1EL.click();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(1);
  });

  it('should select all items', () => {
    component.multiSelect = true;
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();
    component.selectAllItems();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(component.itemsAmount);
  });

  it('should deselect all items', () => {
    component.multiSelect = true;
    hostFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.flexbox'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();
    component.deselectAllItems();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(0);
  });
});
