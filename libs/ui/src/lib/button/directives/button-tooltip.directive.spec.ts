import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { ButtonComponent } from '../button.component';
import { TooltipDirective } from './button-tooltip.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <campus-button tooltip="test">tekst</campus-button>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('TooltipDirective', () => {
  let directive: TooltipDirective;
  let component: ButtonComponent;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    componentDE = testContainerFixture.debugElement.query(
      By.css('campus-button')
    );
    component = <ButtonComponent>componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(TooltipDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).not.toBeNull();
    expect(directive).not.toBeNull();
  });

  it('should apply the tooltip text as a title attribute', () => {
    expect(componentDE.nativeElement.getAttribute('title')).toEqual('test');
  });
});
