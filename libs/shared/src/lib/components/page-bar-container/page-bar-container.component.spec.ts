import { CdkPortal } from '@angular/cdk/portal';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageBarContainerComponent } from './page-bar-container.component';

class MockPortalHost {
  attach() {}
  detach() {}
}

describe('PageBarContainerComponent', () => {
  let component: PageBarContainerComponent;
  let fixture: ComponentFixture<PageBarContainerComponent>;
  let mockPortalHost;
  let spy;
  beforeAll(() => {
    mockPortalHost = new MockPortalHost();
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageBarContainerComponent]
    });
  }));
  describe('creation', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PageBarContainerComponent);
      component = fixture.componentInstance;
      spy = jest.fn().mockReturnValue(mockPortalHost);
      component['getPortalHost'] = spy;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should call getPortalHost during init', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PageBarContainerComponent);
      component = fixture.componentInstance;
      spy = jest.fn().mockReturnValue(mockPortalHost);
      component['getPortalHost'] = spy;
      component.portal = <CdkPortal>{};
    });
    it('should call attacher when initializing', () => {
      const actual = jest.spyOn(mockPortalHost, 'attach');
      component.portal = 'expected value';
      component.ngAfterViewInit();
      expect(actual).toHaveBeenCalledWith('expected value');
    });
  });
});
