export class ResultFunctions {
  public static starsFromScore(score: number, total = 100) {
    if (!score || !total) return 0;

    const percentage = (score * 100) / total;
    if (percentage >= 100) return 3;
    if (percentage >= 75) return 2;
    if (percentage >= 50) return 1;

    return 0;
  }
}
