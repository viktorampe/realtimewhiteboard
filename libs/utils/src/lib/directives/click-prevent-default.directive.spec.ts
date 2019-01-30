import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UtilsModule } from '../utils.module';
import { ClickPreventDefaultDirective } from './click-prevent-default.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <input type="checkbox" (click)="this.onClick()" clickPreventDefault />
  `
})
export class TestContainerComponent {
  onClick() {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container-without',
  template: `
    <input type="checkbox" (click)="this.onClick()" />
  `
})
export class TestContainerWithoutDirectiveComponent {
  onClick() {}
}

@NgModule({
  declarations: [
    TestContainerComponent,
    TestContainerWithoutDirectiveComponent
  ],
  imports: [CommonModule, UtilsModule],
  exports: [TestContainerComponent, TestContainerWithoutDirectiveComponent]
})
export class TestModule {}

describe('ClickPreventDefaultDirective', () => {
  let directive: ClickPreventDefaultDirective;
  let component: Component;
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
    componentDE = testContainerFixture.debugElement.query(By.css('input'));
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(ClickPreventDefaultDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should stop click event default handler', () => {
    const ev = new MouseEvent('click', { bubbles: true });
    spyOn(ev, 'preventDefault');

    componentDE.nativeElement.dispatchEvent(ev);
    expect(ev.preventDefault).toHaveBeenCalled();
  });

  // double check that the default isn't prevented without the directive
  it("shouldn't stop click event stop click event default handler without the directive", () => {
    const ev = new MouseEvent('click', { bubbles: true });
    spyOn(ev, 'preventDefault');

    const testContainerWithoutFixture = TestBed.createComponent(
      TestContainerWithoutDirectiveComponent
    );
    const componentWithoutDE = testContainerWithoutFixture.debugElement.query(
      By.css('input')
    );

    componentWithoutDE.nativeElement.dispatchEvent(ev);
    expect(ev.preventDefault).not.toHaveBeenCalled();
  });
});
