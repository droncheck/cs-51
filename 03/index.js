class BCD {
  static highMask = 0b11110000;
  static lowMask = 0b00001111;

  constructor(value) {
    this.value = value;

    const digits = [];
    if (value === 0) {
      digits.push(0);
    } else {
      let n = value;
      while (n > 0) {
        digits.push(n % 10);
        n = Math.floor(n / 10);
      }
      digits.reverse();
    }
    this.digits = digits;
    this.digitCount = digits.length;

    this.byteCount = Math.ceil(this.digitCount / 2);
    this.bytes = new Uint8Array(this.byteCount);

    for (let i = 0; i < this.digitCount; i += 2) {
      const high = this.digits[i];
      const low = i + 1 < this.digitCount ? this.digits[i + 1] : 0;
      this.bytes[i >> 1] = (high << 4) | low;
    }
  }

  toBigint() {
    // Очевидная реализация
    // return BigInt(this.value);

    // Реализация с извлечением числа из байтов, использующая метод toNumber()
    return BigInt(this.toNumber());
  }
  toNumber() {
    // Очевидная реализация
    // return this.value;

    // Реализация с извлечением числа из байтов
    let result = 0;
    let byteIndex = 0;
    for (let i = 0; i < this.digitCount; i++) {
      const multiplier = 10 ** (this.digitCount - i - 1);

      if (i % 2 === 0) {
        result += ((this.bytes[byteIndex] & BCD.highMask) >> 4) * multiplier;
      } else {
        result += (this.bytes[byteIndex] & BCD.lowMask) * multiplier;
        byteIndex++;
      }
    }
    return result;
  }
  toString() {
    // Очевидная реализация
    // return this.value.toString(10);

    // Реализация с извлечением числа из байтов, использующая метод toNumber()
    return this.toNumber().toString();
  }

  // Возвращает значение разряда BCD числа на указанной позиции.
  // Отрицательная позиция означает разряд "с конца".
  at(index) {
    // Очевидная реализация
    // return this.digits[index < 0 ? this.digitCount + index : index];

    // Реализация с извлечением числа из байтов
    const realIndex = index < 0 ? this.digitCount + index : index;
    const byteIndex = Math.floor(realIndex / 2);
    const bitIndex = realIndex % 2;

    if (bitIndex === 0) {
      return (this.bytes[byteIndex] & BCD.highMask) >> 4;
    } else {
      return this.bytes[byteIndex] & BCD.lowMask;
    }
  }
}

const n = new BCD(65536);

console.log(n.toBigint()); // 65536n
console.log(n.toNumber()); // 65536

console.log(n.at(0)); // 6
console.log(n.at(1)); // 5

console.log(n.at(-1)); // 6
console.log(n.at(-2)); // 3
