export class ColorFunctions {
  private static rgbaKeys = ['r', 'g', 'b', 'a'];

  public static hexToRgb(hex) {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, red: string, green: string, blue: string) =>
          '#' + red + red + green + green + blue + blue
      )
      .substring(1)
      .match(/.{2}/g)
      .map(x => parseInt(x, 16))
      .reduce(
        (acc, value, index) => ({
          ...acc,
          [this.rgbaKeys[index]]: value
        }),
        {}
      );
  }
}
