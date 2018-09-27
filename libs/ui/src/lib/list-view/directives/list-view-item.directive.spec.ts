import { CommonModule } from '@angular/common';
/*
 * Testing an Angular directive
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#pipes
 */
import {
  Component,
  DebugElement,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListViewItemInterface } from '../base classes/list-view-item';
import { UiModule } from './../../ui.module';
import { ListViewComponent } from './../list-view.component';
import { ListItemDirective } from './list-view-item.directive';

@Component({
  selector: 'campus-list-view-item',
  template: `<div>Container content</div>`,
  providers: [
    {
      provide: ListViewItemInterface,
      useExisting: HostComponent
    }
  ]
})
export class HostComponent implements ListViewItemInterface {
  listFormat: string;
}

@Component({
  selector: 'campus-list',
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: ListViewComponent,
      useClass: ListComponent
    }
  ]
})
export class ListComponent {}

@Component({
  selector: 'campus-directive-container',
  template: `
  <campus-list>
    <campus-list-view-item campusListItem></campus-list-view-item>
  </campus-list>
  `
})
export class ContainerComponent {}

@NgModule({
  declarations: [ContainerComponent, HostComponent, ListComponent],
  imports: [CommonModule, UiModule]
})
export class TestModule {}

describe('ListItemDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let comp: ContainerComponent;
  let compDE: DebugElement;
  let dir: ListItemDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [ListViewComponent, ListViewItemInterface],
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

    expect(compDE.nativeElement.classList).toContain(
      'ui-list-view__list__item--selected'
    );
  });

  it('should handle te host click event', () => {
    const isSelected = dir.isSelected;
    compDE.nativeElement.click();
    fixture.detectChanges();

    expect(dir.isSelected).toBe(!isSelected);
  });
});
