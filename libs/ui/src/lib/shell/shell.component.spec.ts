import { Component, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShellComponent } from './shell.component';
import { UiModule } from '../ui.module';
import { ShellLogoDirective } from './directives/shell-logo.directive';
import { ShellLeftContainerDirective } from './directives/shell-left-container.directive';
import { ShellTopContainerDirective } from './directives/shell-top-container.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
  <campus-shell>
    <campus-shell-top-container>test-top</campus-shell-top-container>
    <campus-shell-logo>test-logo</campus-shell-logo>
    <campus-shell-left-container>test-left</campus-shell-left-container>
    <p>Hi there handsome</p>
  </campus-shell>
  `
})
export class TestContainerComponent {
}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [ CommonModule, UiModule ],
  exports: [TestContainerComponent],
  providers: [],
})

export class TestModule {}

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let innerComponent: ShellComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    // regular component
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // templated component
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    innerComponent = <ShellComponent>(
      testContainerFixture.debugElement.query(By.css('campus-shell')).componentInstance
    );
    testContainerFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should project logo content', () => {
    const logo = testContainerFixture.debugElement.query(
      By.directive(ShellLogoDirective)
    ).nativeElement.textContent
    expect(logo).toBe('test-logo');
  });

  it('should project left content', () => {
    const logo = testContainerFixture.debugElement.query(
      By.directive(ShellLeftContainerDirective)
    ).nativeElement.textContent
    expect(logo).toBe('test-left');
  });

  it('should project left content', () => {
    const logo = testContainerFixture.debugElement.query(
      By.directive(ShellTopContainerDirective)
    ).nativeElement.textContent
    expect(logo).toBe('test-top');
  })

  fit('should project the rest of the content in the body', () => {
    const bodyContent: HTMLElement = testContainerFixture.debugElement.query(
      By.css('.ui-shell-body')
    ).nativeElement;
    expect(bodyContent.querySelector('p').textContent).toEqual('Hi there handsome');

  });
});
