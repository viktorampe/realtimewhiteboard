/*
 * Testing an Angular directive
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#pipes
 */
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListViewComponent } from './../list-view.component';
import { ListItemDirective } from './list-view-item.directive';

@Component({
  selector: 'campus-directive-container',
  template: `<div campusListItem>Container content</div>`,
  providers: [ListViewComponent]
})
export class ContainerComponent {}

describe('ListItemDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let comp: ContainerComponent;
  let compDE: DebugElement;
  let dir: ListItemDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListItemDirective, ContainerComponent, ListViewComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContainerComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();

      compDE = fixture.debugElement.query(By.css('[campusListItem]'));
      dir = compDE.injector.get(ListItemDirective);
    });
  }));

  it('should create the host with the directive attached', () => {
    expect(compDE).not.toBeNull();
    expect(dir).not.toBeNull();
  });

  it('should apply the .item-selected class', () => {
    dir.isSelected = true;
    fixture.detectChanges();

    expect(compDE.nativeElement.classList).toContain('item-selected');
  });

  it('should handle te host click event', () => {
    const isSelected = dir.isSelected;
    compDE.nativeElement.click();
    fixture.detectChanges();

    expect(dir.isSelected).toBe(!isSelected);
  });
});
