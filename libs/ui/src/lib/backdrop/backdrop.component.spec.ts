import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WINDOW } from '@campus/browser';
import { MockWindow } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { ENVIRONMENT_UI_TOKEN } from '../tokens';
import {
  BackdropCollapseActionDirective,
  BackdropComponent,
  BackdropRevealActionDirective,
  BackLayerContentDirective,
  FrontLayerContentDirective
} from './backdrop.component';

@Component({
  template: `
    <campus-backdrop [title]="'test'" [dropped]="true">
      <back-layer-content></back-layer-content>
      <backdrop-reveal-action>REVEAL</backdrop-reveal-action>
      <backdrop-collapse-action>COLLAPSE</backdrop-collapse-action>
      <front-layer-content></front-layer-content>
    </campus-backdrop>
  `
})
class BackdropDroppedComponent {}
@Component({
  template: `
    <campus-backdrop [title]="'test'" [dropped]="false">
      <back-layer-content
        ><div style="height: 300px;">test</div></back-layer-content
      >
      <backdrop-reveal-action>REVEAL</backdrop-reveal-action>
      <backdrop-collapse-action>COLLAPSE</backdrop-collapse-action>
      <front-layer-content></front-layer-content>
    </campus-backdrop>
  `
})
class BackdropCollapsedComponent {
  public onDroppedChanged(value) {}
}

@Component({
  template: `
    <campus-backdrop
      [title]="'test'"
      [static]="true"
      (droppedChange)="onDroppedChanged($event)"
    >
      <back-layer-content
        ><div style="height: 300px;">test</div><</back-layer-content
      >
      <backdrop-reveal-action>STATIC</backdrop-reveal-action>
      <front-layer-content></front-layer-content>
    </campus-backdrop>
  `
})
class BackdropStaticComponent {
  public show = false;
  public onDroppedChanged(value) {
    this.show = value;
  }
}

describe('BasicBackdropComponent', () => {
  let component: BackdropComponent;
  let fixture: ComponentFixture<BackdropComponent>;
  let window: Window;
  let ui: { footerHeight: number; backdrop: { safeMargin: number } };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CommonModule],
      providers: [
        {
          provide: ENVIRONMENT_UI_TOKEN,
          useValue: { footerHeight: 10, backdrop: { safeMargin: 64 } }
        },
        { provide: WINDOW, useClass: MockWindow }
      ],
      declarations: [
        BackdropComponent,
        BackLayerContentDirective,
        FrontLayerContentDirective,
        BackdropRevealActionDirective,
        BackdropCollapseActionDirective,
        BackdropDroppedComponent,
        BackdropCollapsedComponent,
        BackdropStaticComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdropComponent);
    window = TestBed.get(WINDOW);
    ui = TestBed.get(ENVIRONMENT_UI_TOKEN);
    component = fixture.componentInstance;
    window.resizeTo(1000, 1000);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Collapsed', () => {
    let hostComponent: BackdropCollapsedComponent;
    let hostFixture: ComponentFixture<BackdropCollapsedComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(BackdropCollapsedComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });
    it('should show reveal action when collapsed', () => {
      const revealDE = hostFixture.debugElement.query(
        By.directive(BackdropRevealActionDirective)
      );
      const collapseDE = hostFixture.debugElement.query(
        By.directive(BackdropCollapseActionDirective)
      );

      expect(revealDE).not.toBeNull();
      expect(collapseDE).toBeNull();
    });
    it('should update dropped when not in static mode', () => {
      const emitSpy = jest.spyOn(component.droppedChange, 'emit');
      component.dropped = false;

      component.updateDropped(true);
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should remove --dropped from classList when not dropped', () => {
      const bacdropDE = fixture.debugElement.query(By.css('.ui-backdrop'));
      component.dropped = false;
      fixture.detectChanges();

      expect(bacdropDE.nativeElement.classList).not.toContain(
        'ui-backdrop--dropped'
      );
    });

    describe('calculations for smaller backcontent than window height', () => {
      const styles = {
        windowHeight: 1000,
        backTop: 200,
        backHeight: 48,
        backContentHeight: 100
      };

      beforeEach(() => {
        const backTopSpy = jest.spyOn(component, 'getBacklayerTop');
        const backHeightSpy = jest.spyOn(component, 'getBacklayerHeight');
        const frontTopSpy = jest.spyOn(component, 'getFrontlayerTop');

        backTopSpy.mockReturnValue(styles.backTop);
        backHeightSpy.mockReturnValue(styles.backHeight);
        frontTopSpy.mockReturnValue(
          styles.backTop + styles.backHeight + styles.backContentHeight
        );

        component.ngAfterViewInit();
        fixture.detectChanges();
      });
      it('should calculate delta', () => {
        expect(component.delta).toBe(100);
      });

      it('should calculate maxDelta', () => {
        expect(component.maxDelta).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.backdrop.safeMargin
        );
      });

      it('should calculate frontLayerHeight from bottom of backLayer Header to bottom of screen', () => {
        expect(component.frontLayerHeight).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.footerHeight
        );
      });

      it('should calculate the max height for the backlayer content', () => {
        expect(component.backLayerContentMaxHeight).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.backdrop.safeMargin -
            ui.footerHeight
        );
      });
      it('should generate the correct animation state when collapsed, with translateY param equals -delta', () => {
        expect(component.getDropTranslation()).toEqual({
          params: { translateY: '-100px' },
          value: 'covered'
        });
      });
    });

    describe('calculations for bigger backcontent than window height', () => {
      const styles = {
        windowHeight: 1000,
        backTop: 200,
        backHeight: 48,
        backContentHeight: 1500
      };

      beforeEach(() => {
        const backTopSpy = jest.spyOn(component, 'getBacklayerTop');
        const backHeightSpy = jest.spyOn(component, 'getBacklayerHeight');
        const frontTopSpy = jest.spyOn(component, 'getFrontlayerTop');

        backTopSpy.mockReturnValue(styles.backTop);
        backHeightSpy.mockReturnValue(styles.backHeight);
        frontTopSpy.mockReturnValue(
          styles.backTop + styles.backHeight + styles.backContentHeight
        );

        component.ngAfterViewInit();
        fixture.detectChanges();
      });
      it('should calculate delta', () => {
        expect(component.delta).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.backdrop.safeMargin -
            ui.footerHeight
        );
      });

      it('should calculate maxDelta', () => {
        expect(component.maxDelta).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.backdrop.safeMargin
        );
      });

      it('should calculate frontLayerHeight from bottom of backLayer Header to bottom of screen', () => {
        expect(component.frontLayerHeight).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.footerHeight
        );
      });

      it('should calculate the max height for the backlayer content', () => {
        expect(component.backLayerContentMaxHeight).toBe(
          styles.windowHeight -
            styles.backTop -
            styles.backHeight -
            ui.backdrop.safeMargin -
            ui.footerHeight
        );
      });
      it('should generate the correct animation state when collapsed, with translateY param equals -delta', () => {
        const translateY =
          styles.windowHeight -
          styles.backTop -
          styles.backHeight -
          ui.backdrop.safeMargin -
          ui.footerHeight;
        expect(component.getDropTranslation()).toEqual({
          params: { translateY: `-${translateY}px` },
          value: 'covered'
        });
      });
    });
  });

  describe('Dropped', () => {
    let hostComponent: BackdropDroppedComponent;
    let hostFixture: ComponentFixture<BackdropDroppedComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(BackdropDroppedComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });
    it('should show collpase action when dropped', () => {
      const revealDE = hostFixture.debugElement.query(
        By.directive(BackdropRevealActionDirective)
      );
      const collapseDE = hostFixture.debugElement.query(
        By.directive(BackdropCollapseActionDirective)
      );

      expect(revealDE).toBeNull();
      expect(collapseDE).not.toBeNull();
    });

    it('should add --dropped to classList when dropped', () => {
      const bacdropDE = fixture.debugElement.query(By.css('.ui-backdrop'));
      component.dropped = true;
      fixture.detectChanges();

      expect(bacdropDE.nativeElement.classList).toContain(
        'ui-backdrop--dropped'
      );
    });

    describe('calculations for bigger backcontent than window height', () => {
      const styles = {
        windowHeight: 1000,
        backTop: 200,
        backHeight: 48,
        backContentHeight: 2000
      };

      beforeEach(() => {
        const backTopSpy = jest.spyOn(component, 'getBacklayerTop');
        const backHeightSpy = jest.spyOn(component, 'getBacklayerHeight');
        const frontTopSpy = jest.spyOn(component, 'getFrontlayerTop');

        backTopSpy.mockReturnValue(styles.backTop);
        backHeightSpy.mockReturnValue(styles.backHeight);
        frontTopSpy.mockReturnValue(
          styles.backTop + styles.backHeight + styles.backContentHeight
        );

        component.dropped = true;

        component.ngAfterViewInit();
        fixture.detectChanges();
      });

      it('should generate the correct animation state when collapsed, with translateY param equals -maxDelta', () => {
        const translateY =
          styles.windowHeight -
          styles.backTop -
          styles.backHeight -
          ui.backdrop.safeMargin -
          ui.footerHeight;
        expect(component.dropTranslation).toEqual({
          params: { translateY: `-${translateY}px` },
          value: 'dropped'
        });
      });
    });
  });

  describe('Static', () => {
    let hostComponent: BackdropStaticComponent;
    let hostFixture: ComponentFixture<BackdropStaticComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(BackdropStaticComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });
    it('should not update dropped when static', fakeAsync(() => {
      const emitSpy = jest.spyOn(hostComponent, 'onDroppedChanged');
      const revealDE = hostFixture.debugElement.query(
        By.css('.ui-backdrop__header__reveal-action')
      );
      hostFixture.detectChanges();
      revealDE.nativeElement.click();
      tick();
      expect(hostComponent.show).toBeFalsy();
    }));
  });
});
