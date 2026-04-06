const UINT32_MAX = 2 ** 32 - 1;

function assertUint32Argument(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(
      "number: ожидается число; передано значение недопустимого типа.",
    );
  }
  if (!Number.isInteger(value)) {
    throw new TypeError(
      "number: ожидается целое число; дробная часть и бесконечность недопустимы.",
    );
  }
  if (value < 0 || value > UINT32_MAX) {
    throw new RangeError(
      "number: ожидается беззнаковое 32-битное целое (диапазон от 0 до ${UINT32_MAX} включительно).",
    );
  }
}

function assertShiftArgument(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(
      "shift: ожидается число; передано значение недопустимого типа.",
    );
  }
  if (!Number.isInteger(value)) {
    throw new TypeError(
      "shift: ожидается целое число; дробная часть недопустима.",
    );
  }
  if (value < 0 || value > 32) {
    throw new RangeError(
      "shift: ожидается целое число от 0 до 32 включительно.",
    );
  }
}

function cyclicLeftShift(number, shift) {
  assertUint32Argument(number);
  assertShiftArgument(shift);

  if (shift === 0 || shift === 32) {
    return number >>> 0;
  }

  const result = (number << shift) | (number >>> (32 - shift));
  return result >>> 0;
}

function cyclicRightShift(number, shift) {
  assertUint32Argument(number);
  assertShiftArgument(shift);

  if (shift === 0 || shift === 32) {
    return number >>> 0;
  }

  const result = (number << (32 - shift)) | (number >>> shift);
  return result >>> 0;
}

function formatBits32(number) {
  const bits = (number >>> 0).toString(2).padStart(32, "0");
  return `${bits.slice(0, 8)}_${bits.slice(8, 16)}_${bits.slice(16, 24)}_${bits.slice(24)}`;
}

// Биты отбрасываемые из-за переполнения слева дополняются справа
console.log(
  cyclicLeftShift(0b10000000_00000000_00000000_00000001, 1) ===
    0b00000000_00000000_00000000_00000011,
);
console.log(
  formatBits32(cyclicLeftShift(0b10000000_00000000_00000000_00000001, 1)),
);
console.log(formatBits32(0b00000000_00000000_00000000_00000011));
console.log(
  cyclicLeftShift(0b11110000_00000000_00000000_00000000, 4) ===
    0b00000000_00000000_00000000_00001111,
);
console.log(
  formatBits32(cyclicLeftShift(0b11110000_00000000_00000000_00000000, 4)),
);
console.log(formatBits32(0b00000000_00000000_00000000_00001111));
console.log(
  cyclicLeftShift(0b00000000_00000000_00000000_11111111, 8) ===
    0b00000000_00000000_11111111_00000000,
);
console.log(
  formatBits32(cyclicLeftShift(0b00000000_00000000_00000000_11111111, 8)),
);
console.log(formatBits32(0b00000000_00000000_11111111_00000000));
console.log(
  cyclicLeftShift(0b00000000_00000000_00000000_11111111, 0) ===
    0b00000000_00000000_00000000_11111111,
);
console.log(
  formatBits32(cyclicLeftShift(0b00000000_00000000_00000000_11111111, 0)),
);
console.log(formatBits32(0b00000000_00000000_00000000_11111111));
console.log(
  cyclicLeftShift(0b11111111_11111111_11111111_11111111, 3) ===
    0b11111111_11111111_11111111_11111111,
);
console.log(
  formatBits32(cyclicLeftShift(0b11111111_11111111_11111111_11111111, 3)),
);
console.log(formatBits32(0b11111111_11111111_11111111_11111111));

// Биты отбрасываемые из-за переполнения cправа дополняются слева
console.log(
  cyclicRightShift(0b10000000_00000000_00000000_00000001, 2) ===
    0b01100000_00000000_00000000_00000000,
);
console.log(
  formatBits32(cyclicRightShift(0b10000000_00000000_00000000_00000001, 2)),
);
console.log(formatBits32(0b01100000_00000000_00000000_00000000));

console.log(
  cyclicRightShift(0b00000000_00000000_00000000_00000011, 1) ===
    0b10000000_00000000_00000000_00000001,
);
console.log(
  formatBits32(cyclicRightShift(0b00000000_00000000_00000000_00000011, 1)),
);
console.log(formatBits32(0b10000000_00000000_00000000_00000001));

console.log(
  cyclicRightShift(0b00000000_00000000_00000000_00001111, 4) ===
    0b11110000_00000000_00000000_00000000,
);
console.log(
  formatBits32(cyclicRightShift(0b00000000_00000000_00000000_00001111, 4)),
);
console.log(formatBits32(0b11110000_00000000_00000000_00000000));

console.log(
  cyclicRightShift(0b00000000_00000000_11111111_00000000, 8) ===
    0b00000000_00000000_00000000_11111111,
);
console.log(
  formatBits32(cyclicRightShift(0b00000000_00000000_11111111_00000000, 8)),
);
console.log(formatBits32(0b00000000_00000000_00000000_11111111));
console.log(
  cyclicRightShift(0b00000000_00000000_11111111_00000000, 0) ===
    0b00000000_00000000_11111111_00000000,
);
console.log(
  formatBits32(cyclicRightShift(0b00000000_00000000_11111111_00000000, 0)),
);
console.log(formatBits32(0b00000000_00000000_11111111_00000000));

console.log(
  cyclicRightShift(0b00000000_00000000_11111111_00000000, 16) ===
    cyclicLeftShift(0b00000000_00000000_11111111_00000000, 16),
);
console.log(
  formatBits32(cyclicRightShift(0b00000000_00000000_11111111_00000000, 16)),
);
console.log(
  formatBits32(cyclicLeftShift(0b00000000_00000000_11111111_00000000, 16)),
);
