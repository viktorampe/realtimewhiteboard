import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  EnvironmentIconMappingInterface,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  SharedModule
} from '@campus/shared';
import { CampusRouterlinkDirective } from './campus-routerlink.directive';
const navigateSpy = jest.fn();
const windowSpy = jest.fn();

export class Mapping implements EnvironmentIconMappingInterface {
  [icon: string]: string;
}

export class MockRouter {
  navigateByUrl = navigateSpy;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <a [campusRouterLink]="'http://melvin-kellner.com'">EXTERNAL LINK</a>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, SharedModule],
  providers: [
    {
      provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
      useClass: Mapping
    },
    { provide: Router, useClass: MockRouter }
  ],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('CampusRouterlinkDirective', () => {
  let directive: CampusRouterlinkDirective;
  let component: any;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let componentDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    windowSpy.mockReset();
    navigateSpy.mockReset();

    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    componentDE = testContainerFixture.debugElement.query(By.css('a'));
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(CampusRouterlinkDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should return correct url in case of external link', () => {
    expect(directive.getExternalLink('http://melvin-kellner.com')).toBe(
      'http://melvin-kellner.com'
    );
    expect(directive.getExternalLink('https://imgur.com/gallery/jlGc4')).toBe(
      'https://imgur.com/gallery/jlGc4'
    );
    expect(directive.getExternalLink('http://google.com')).toBe(
      'http://google.com'
    );
    expect(
      directive.getExternalLink(
        'https://www.google.com/search?q=recursion&spell=1&sa=X&ved=0ahUKEwjQ8NOh0ZLgAhUNmbQKHbKVC7IQBQgrKAA&biw=983&bih=743'
      )
    ).toBe(
      'https://www.google.com/search?q=recursion&spell=1&sa=X&ved=0ahUKEwjQ8NOh0ZLgAhUNmbQKHbKVC7IQBQgrKAA&biw=983&bih=743'
    );
  });

  it('should return empty url in case of internal link', () => {
    expect(directive.getExternalLink('/google.com')).toBeNull();
    expect(directive.getExternalLink('/dev/com')).toBeNull();
    expect(directive.getExternalLink('/com')).toBeNull();
  });

  it('should navigate to internal link', () => {
    directive.navigateToLink('/google.com');
    expect(navigateSpy).toHaveBeenCalledWith('/google.com');
    directive.navigateToLink('/dev');
    expect(navigateSpy).toHaveBeenCalledWith('/dev');
  });

  it('should not navigate to internal link if external link is provided', () => {
    directive.navigateToLink(
      'https://www.google.com/search?q=recursion&spell=1&sa=X&ved=0ahUKEwjQ8NOh0ZLgAhUNmbQKHbKVC7IQBQgrKAA&biw=983&bih=743'
    );
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not navigate to internal link if external link is provided', () => {
    navigateSpy.mockReset();
    directive.navigateToLink(
      'https://www.google.com/search?q=recursion&spell=1&sa=X&ved=0ahUKEwjQ8NOh0ZLgAhUNmbQKHbKVC7IQBQgrKAA&biw=983&bih=743'
    );
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
