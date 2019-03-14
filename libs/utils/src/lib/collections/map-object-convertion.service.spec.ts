//file.only

import { TestBed } from '@angular/core/testing';
import { MapObjectConvertionService } from './map-object-convertion.service';

describe('FilterService', () => {
  let mapObjectConvertionService: MapObjectConvertionService;
  const mockData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapObjectConvertionService]
    });

    mapObjectConvertionService = TestBed.get(MapObjectConvertionService);
  });

  it('should be created', () => {
    expect(mapObjectConvertionService).toBeTruthy();
  });
  describe('mapToObject', () => {
    it('should return an object if the map type is string', () => {
      const map = new Map<string, number>([
        ['one', 23],
        ['two', 838],
        ['three', 847]
      ]);
      expect(mapObjectConvertionService.mapToObject(map)).toEqual({
        one: 23,
        two: 838,
        three: 847
      });
    });
    it('should return an object if the map type is number', () => {
      const map = new Map<number, number>([[1, 23], [2, 838], [3, 847]]);
      const obj = mapObjectConvertionService.mapToObject(map);
      expect(obj).toEqual({
        1: 23,
        2: 838,
        3: 847
      });
    });
    it('should convert value to object if the value is a map', () => {
      const map = new Map<string, Map<string, string>>([
        [
          'one',
          new Map([['some', 'value for some'], ['foo', 'value for foo']])
        ],
        ['two', new Map([['bar', 'value for bar']])],
        [
          'three',
          new Map([
            ['foobar', 'value for foobar'],
            ['other', 'value for other']
          ])
        ]
      ]);
      expect(mapObjectConvertionService.mapToObject(map)).toEqual({
        one: {
          some: 'value for some',
          foo: 'value for foo'
        },
        two: { bar: 'value for bar' },
        three: { foobar: 'value for foobar', other: 'value for other' }
      });
    });
  });
  describe('objectToMap', () => {
    it('should convert a string object to a map', () => {
      const obj: { [key: string]: number } = {
        one: 23,
        two: 838,
        three: 847
      };
      expect(mapObjectConvertionService.objectToMap(obj)).toEqual(
        new Map<string, number>([['one', 23], ['two', 838], ['three', 847]])
      );
    });
    it('should convert a number object to a map', () => {
      const obj: { [key: number]: number } = {
        1: 23,
        2: 838,
        3: 847
      };
      expect(mapObjectConvertionService.objectToMap(obj, true)).toEqual(
        new Map<number, number>([[1, 23], [2, 838], [3, 847]])
      );
    });
    it('should convert a string object to a map<string, any> if force is false', () => {
      const obj: { [key: number]: number } = {
        1: 23,
        2: 838,
        3: 847
      };
      expect(mapObjectConvertionService.objectToMap(obj, false)).toEqual(
        new Map<string, number>([['1', 23], ['2', 838], ['3', 847]])
      );
    });
  });
});
