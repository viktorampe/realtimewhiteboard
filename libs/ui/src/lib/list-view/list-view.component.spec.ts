import { ListItemDirective } from './list-item/list-item.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewComponent } from './list-view.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListViewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should show content as childcomponents', () => {
  //   const componentDE = fixture.debugElement;
  //   const itemDEList = componentDE.queryAll(By.css(mockData.childComponentTag));

  //   expect(itemDEList.length).toBe(mockData.contentArray.length);
  // });

  // it('should create without content', () => {
  //   component.contentArray = null;
  //   fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });

  // it('should show the text placeholder if without content', () => {
  //   component.contentArray = null;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;

  //   expect(componentDE.nativeElement.textContent).toContain(
  //     mockData.placeHolderText
  //   );
  // });

  // it('should apply the flex-grid class', () => {
  //   component.isGrid = true;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;
  //   const itemListDE = componentDE.query(By.css('.flexbox'));

  //   expect(itemListDE.nativeElement.className).toContain('flex-grid');
  //   expect(itemListDE.nativeElement.className).not.toContain('flex-list');
  // });

  // it('should apply the flex-list class', () => {
  //   component.isGrid = false;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;
  //   const itemListDE = componentDE.query(By.css('.flexbox'));

  //   expect(itemListDE.nativeElement.className).toContain('flex-list');
  //   expect(itemListDE.nativeElement.className).not.toContain('flex-grid');
  // });

  // it('should select only 1 item', () => {
  //   component.multiSelect = false;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;
  //   const itemDEList = componentDE.queryAll(By.css(mockData.childComponentTag));

  //   let selection: object[];
  //   component.selectionChanged.subscribe(value => (selection = value));

  //   const childComponent1EL = itemDEList[0].nativeElement as ListItemComponent;
  //   const childComponent2EL = itemDEList[1].nativeElement as ListItemComponent;

  //   component.itemClicked(childComponent1EL.folder);
  //   component.itemClicked(childComponent2EL.folder);

  //   expect(component.selectionArray.length).toBe(1);
  //   expect(component.selectionArray[0]).toBe(childComponent2EL.folder);

  //   //Output
  //   expect(selection.length).toBe(1);
  //   expect(selection).toContain(childComponent2EL.folder);
  // });

  // it('should select multiple items', () => {
  //   component.multiSelect = true;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;
  //   const itemDEList = componentDE.queryAll(By.css(mockData.childComponentTag));

  //   let selection: object[];
  //   component.selectionChanged.subscribe(value => (selection = value));

  //   const childComponent1EL = itemDEList[0].nativeElement as ListItemComponent;
  //   const childComponent2EL = itemDEList[1].nativeElement as ListItemComponent;

  //   component.itemClicked(childComponent1EL.folder);
  //   component.itemClicked(childComponent2EL.folder);

  //   expect(component.selectionArray.length).toBe(2);
  //   expect(component.selectionArray).toContain(childComponent1EL.folder);
  //   expect(component.selectionArray).toContain(childComponent2EL.folder);

  //   //Output
  //   expect(selection.length).toBe(2);
  //   expect(selection).toContain(childComponent1EL.folder);
  //   expect(selection).toContain(childComponent2EL.folder);
  // });

  // it('should deselect an item', () => {
  //   component.multiSelect = true;
  //   fixture.detectChanges();

  //   const componentDE = fixture.debugElement;
  //   const itemDEList = componentDE.queryAll(By.css(mockData.childComponentTag));

  //   let selection: object[];
  //   component.selectionChanged.subscribe(value => (selection = value));

  //   const childComponent1EL = itemDEList[0].nativeElement as ListItemComponent;
  //   const childComponent2EL = itemDEList[1].nativeElement as ListItemComponent;

  //   component.itemClicked(childComponent1EL.folder);
  //   component.itemClicked(childComponent2EL.folder);
  //   component.itemClicked(childComponent1EL.folder);

  //   expect(component.selectionArray.length).toBe(1);
  //   expect(component.selectionArray).not.toContain(childComponent1EL.folder);
  //   expect(component.selectionArray).toContain(childComponent2EL.folder);

  //   //Output
  //   expect(selection.length).toBe(1);
  //   expect(selection).not.toContain(childComponent1EL.folder);
  //   expect(selection).toContain(childComponent2EL.folder);
  // });
});
