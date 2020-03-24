export interface HumanDateTimeRuleInterface {
  condition(date: number, referenceDate: number): boolean;
  value(date: number, referenceDate: number): string;
}

export interface HumanDateTimeArgsInterface {
  rules: HumanDateTimeRuleInterface[];
  referenceDate?: Date; // default -> now
  locale?: string; // default -> 'nl-BE'
  datePrefix?: string;
  addDate?: boolean;
}
