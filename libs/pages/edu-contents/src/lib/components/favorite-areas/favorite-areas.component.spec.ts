import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { FavoriteAreasComponent } from './favorite-areas.component';

describe('FavoriteAreasComponent', () => {
  let component: FavoriteAreasComponent;
  let fixture: ComponentFixture<FavoriteAreasComponent>;

  const mockLearningAreas = [
    new LearningAreaFixture({
      name: 'Wiskunde',
      icon: 'polpo-wiskunde',
      color: '#2c354f',
      id: 1
    }),
    new LearningAreaFixture({
      name: 'Wetenschappen',
      icon: 'polpo-natuurwetenschappen',
      color: '#53463c',
      id: 2
    })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule],
      declarations: [FavoriteAreasComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteAreasComponent);
    component = fixture.componentInstance;

    component.favoriteLearningAreas = mockLearningAreas;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a drop area', () => {
    const dropArea = fixture.debugElement.queryAll(By.css('campus-drop-area'));

    expect(dropArea).toBeTruthy();
  });

  it('should show the favorite learning areas correctly', () => {
    const tiles = fixture.debugElement.queryAll(By.css('campus-tile'));

    for (let i = 0; i < mockLearningAreas.length; i++) {
      const area = mockLearningAreas[i];
      const tile = tiles[i];

      expect(tile.componentInstance.label).toBe(area.name);
      expect(tile.componentInstance.icon).toBe(area.icon);
      expect(tile.componentInstance.color).toBe(area.color);
    }
  });

  it('should emit learning area when delete favorite is clicked', () => {
    const deleteSpy = spyOn(component.removeAreaFromFavorites, 'emit');
    const deleteLink = fixture.debugElement.query(
      By.css('campus-tile .ui-tile__actions__action')
    );
    deleteLink.nativeElement.click();

    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(mockLearningAreas[0]);
  });
});
