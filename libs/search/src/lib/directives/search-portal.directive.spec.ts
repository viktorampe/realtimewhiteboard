import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchPortalDirective } from './search-portal.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div searchPortal="foo"></div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent, SearchPortalDirective],
  imports: [CommonModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('SearchPortalDirective', () => {
  let component: Component;
  let directive: SearchPortalDirective;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let componentDE: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  beforeEach(() => {
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    componentDE = testContainerFixture.debugElement.query(By.css('div'));
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(SearchPortalDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should set the searchPortal input', () => {
    expect(directive.searchPortal).toBe('foo');
  });

  it('should set set the viewContainerRef', () => {
    expect(directive.viewContainerRef).toBeTruthy();
  });
});
