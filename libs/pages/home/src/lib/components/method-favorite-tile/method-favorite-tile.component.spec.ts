import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EduContentFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodFavoriteTileComponent } from './method-favorite-tile.component';

describe('MethodFavoriteTileComponent', () => {
  let component: MethodFavoriteTileComponent;
  let fixture: ComponentFixture<MethodFavoriteTileComponent>;

  const mockLogoUrl = 'katapult.svg';
  const mockBookId = 1;
  const mockEduContent = new EduContentFixture();
  const mockFavoriteName = 'Katapult 1';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodFavoriteTileComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodFavoriteTileComponent);
    component = fixture.componentInstance;
    component.logoUrl = mockLogoUrl;
    component.bookId = mockBookId;
    component.eduContent = mockEduContent;
    component.name = mockFavoriteName;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the logo', () => {
    const imageDE = fixture.debugElement.query(
      By.css('.pages-home-method-favorite-tile__image')
    );

    expect(imageDE.nativeElement.src).toContain(mockLogoUrl);
  });

  it('should show the name of the favorite', () => {
    const nameDE = fixture.debugElement.query(
      By.css('.pages-home-method-favorite-tile__title')
    );

    expect(nameDE.nativeElement.textContent).toBe(mockFavoriteName);
  });

  it('should emit clickOpenBoeke when clicking the book button', () => {
    const bookButtonDE = fixture.debugElement.query(
      By.css('.pages-home-method-favorite-tile__button')
    );

    jest.spyOn(component.clickOpenBoeke, 'emit');

    bookButtonDE.nativeElement.click();
    expect(component.clickOpenBoeke.emit).toHaveBeenCalled();
    expect(component.clickOpenBoeke.emit).toHaveBeenCalledWith(mockEduContent);
  });
});
