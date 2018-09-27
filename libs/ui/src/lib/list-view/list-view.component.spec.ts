import { CommonModule } from '@angular/common';
import {
  Component,
  DebugElement,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '../ui.module';
import { ListViewItemInterface } from './base classes/list-view-item';
import { ListViewComponent } from './list-view.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
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
export class TestContainerComponent {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'empty-test-container',
  template: `
  <campus-list-view>
  </campus-list-view>
  `
})
export class EmptyTestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent, EmptyTestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent, EmptyTestContainerComponent]
})
export class TestModule {}

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [ListViewComponent, ListViewItemInterface],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    // regular component
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // templated component
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    component = <ListViewComponent>(
      testContainerFixture.debugElement.query(By.css('campus-list-view'))
        .componentInstance
    );
    testContainerFixture.detectChanges();

    componentDE = testContainerFixture.debugElement.query(
      By.css('campus-list-view')
    );
  });

  it('should create', () => {
    expect(testContainerComponent).toBeTruthy();
  });

  it('should create innerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should find projected content as children', () => {
    expect(component.items.length).toBe(6);
  });

  it('should show the text placeholder if without content', () => {
    let emptyTestContainerFixture: ComponentFixture<
      EmptyTestContainerComponent
    >;
    let emptyTestContainerComponent: EmptyTestContainerComponent;

    emptyTestContainerFixture = TestBed.createComponent(
      EmptyTestContainerComponent
    );
    emptyTestContainerComponent = emptyTestContainerFixture.componentInstance;

    component = <ListViewComponent>(
      emptyTestContainerFixture.debugElement.query(By.css('campus-list-view'))
        .componentInstance
    );
    emptyTestContainerFixture.detectChanges();

    componentDE = emptyTestContainerFixture.debugElement.query(
      By.css('campus-list-view')
    );

    expect(componentDE.nativeElement.textContent).toContain(
      component.placeHolderText
    );
  });

  it('should apply the flex-grid class', () => {
    component.listFormat = 'grid';
    testContainerFixture.detectChanges();
    fixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));

    expect(itemListDE.nativeElement.className).toContain(
      'ui-list-view__list--grid'
    );
    expect(itemListDE.nativeElement.className).not.toContain(
      'ui-list-view__list--line'
    );
  });

  it('should apply the flex-line class', () => {
    component.listFormat = 'line';
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));

    expect(itemListDE.nativeElement.className).toContain(
      'ui-list-view__list--line'
    );
    expect(itemListDE.nativeElement.className).not.toContain(
      'ui-list-view__list--grid'
    );
  });

  it('should select only 1 item', () => {
    component.multiSelect = false;
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));
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
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));
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
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));
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
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));
    const itemDEList = itemListDE.queryAll(By.css('[campusListItem]'));

    const childComponent1EL = itemDEList[0].nativeElement;
    const childComponent2EL = itemDEList[1].nativeElement;

    childComponent1EL.click();
    childComponent2EL.click();
    component.selectAllItems();

    const selectedItems = component.items.filter(i => i.isSelected);

    expect(selectedItems.length).toBe(component.items.length);
  });

  it('should deselect all items', () => {
    component.multiSelect = true;
    testContainerFixture.detectChanges();

    const itemListDE = componentDE.query(By.css('.ui-list-view__list'));
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
