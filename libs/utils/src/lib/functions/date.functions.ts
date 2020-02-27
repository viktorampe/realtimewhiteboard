export class DateFunctions {
  public static startOfWeek(date) {
    const copy = new Date(date);
    const diff =
      copy.getDate() - copy.getDay() + (copy.getDay() === 0 ? -6 : 1);
    copy.setDate(diff);
    copy.setHours(0, 0, 0, 0);

    return copy;
  }

  public static nextWeek(date) {
    const copy = DateFunctions.startOfWeek(date);
    copy.setDate(copy.getDate() + 7);
    copy.setHours(0, 0, 0, 0);

    return copy;
  }

  public static lastWeek(date) {
    const copy = DateFunctions.startOfWeek(date);
    copy.setDate(copy.getDate() - 7);
    copy.setHours(0, 0, 0, 0);

    return copy;
  }

  public static endOfWeek(date) {
    const copy = DateFunctions.nextWeek(date);
    copy.setDate(copy.getDate() - 1);
    copy.setHours(23, 59, 59, 999);

    return copy;
  }

  // return start- and endDate of schoolyear
  public static getSchoolYearBoundaries(
    date: Date
  ): { start: Date; end: Date } {
    // months are 0-based
    const startYear =
      date.getMonth() >= 8 ? date.getFullYear() : date.getFullYear() - 1;

    return {
      start: new Date(startYear, 8, 1),
      end: new Date(startYear + 1, 5, 30)
    };
  }
}
