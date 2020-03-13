export class ResultFunctions {
  public static starsFromScore(score: number, total = 100) {
    if (score) {
      if (score === 100) {
        return 3;
      }
      if (score >= 75) {
        return 2;
      }
      if (score >= 50) {
        return 1;
      }
    }
    return 0;
  }
}
