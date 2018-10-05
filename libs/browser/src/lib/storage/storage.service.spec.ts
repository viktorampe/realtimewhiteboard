import { inject, TestBed } from '@angular/core/testing';
import { BROWSER_STORAGE, StorageService } from './storage.service';

let data: any;
const windowStorage = {
  getItem: key => {
    return data[key];
  },
  setItem: (key, value) => {
    data[key] = value;
  },
  removeItem: key => {
    delete data[key];
  },
  clear: () => {
    data = {};
  }
};

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: BROWSER_STORAGE,
          useValue: windowStorage
        }
      ]
    });
    data = { foo: 'bar' };
  });

  it('should be created', inject(
    [StorageService],
    (service: StorageService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should get a value', inject(
    [StorageService],
    (service: StorageService) => {
      expect(service.get('foo')).toBe('bar');
    }
  ));

  it('should set a value', inject(
    [StorageService],
    (service: StorageService) => {
      service.set('foo', '');
      expect(service.get('foo')).toBe('');
    }
  ));

  it('should remove a value', inject(
    [StorageService],
    (service: StorageService) => {
      service.set('test', 'baz');
      expect(service.get('test')).toBe('baz');
      service.remove('test');
      expect(service.get('test')).toBeUndefined();
    }
  ));

  it('should clear a values', inject(
    [StorageService],
    (service: StorageService) => {
      service.clear();
      expect(Object.keys(data).length).toBe(0);
    }
  ));
});
