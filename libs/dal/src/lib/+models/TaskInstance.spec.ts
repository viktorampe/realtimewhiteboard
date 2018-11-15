import { TaskInstance } from './TaskInstance';

describe('TaskInstance', () => {
  let taskInstance;

  const RealDate = Date;

  function mockDate(timestamp: number) {
    global.Date = class extends RealDate {
      constructor(...args) {
        super();
        return new RealDate(timestamp);
      }
    };
  }

  beforeEach(() => {
    taskInstance = new TaskInstance();
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('it should return 100 as progress if startdate == endDate', () => {
    taskInstance.start = new Date(1541599801751);
    taskInstance.end = new Date(1541599801751);
    expect(taskInstance.getProgress()).toBe(100);
  });

  it('it should return 0 as progress if startDate == currentDate && enddate > startDate', () => {
    taskInstance.start = new Date(1541599801751);
    taskInstance.end = new Date(1541999801751);
    mockDate(1541599801751);
    expect(taskInstance.getProgress()).toBe(0);
  });

  it('should return 100 if the currentdate > enddate', () => {
    taskInstance.start = new Date(1541599801751);
    taskInstance.end = new Date(1541999801751);
    const currentDate = new Date(2541999801751);
    expect(taskInstance.getProgress()).toBe(100);
  });

  it('should throw an error if startdate > enddate', () => {
    let caughtError: Error = null;
    taskInstance.start = new Date(2541599801751);
    taskInstance.end = new Date(1541999801751);
    mockDate(1641999801751);
    //cant get jest toThrowError to work for some reason
    try {
      taskInstance.getProgress();
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toBeTruthy();
  });

  it('should return 0 if before startdate', () => {
    mockDate(1641999801751);

    taskInstance.start = null;
    taskInstance.end = new Date(1541999801751);
    expect(taskInstance.getProgress()).toBe(0);

    taskInstance.start = new Date(2541599801751);
    taskInstance.end = null;
    expect(taskInstance.getProgress()).toBe(0);

    taskInstance.start = null;
    taskInstance.end = null;
    expect(taskInstance.getProgress()).toBe(0);
  });

  it('should return 0 if startdate and or enddate is missing', () => {
    taskInstance.start = new Date(1641999801752);
    taskInstance.end = new Date(1641999801754);
    mockDate(1641999801751);
    expect(taskInstance.getProgress()).toBe(0);
  });
});
