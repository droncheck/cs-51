type RGBA = [red: number, green: number, blue: number, alpha: number];

enum TraverseMode {
  RowMajor,
  ColMajor,
}

interface PixelStream {
  getPixel(x: number, y: number): RGBA;
  setPixel(x: number, y: number, rgba: RGBA): RGBA;
  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void;
}

type PixelStreamClass = new (width: number, height: number) => PixelStream;

interface RGBAObject {
  r: number;
  g: number;
  b: number;
  a: number;
}

function randomRGBA(): RGBA {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    parseFloat(Math.random().toFixed(1)),
  ];
}

function generatePixelStream(
  width: number,
  height: number,
  PixelStreamClass: PixelStreamClass,
): PixelStream {
  const pixelStream = new PixelStreamClass(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixelStream.setPixel(x, y, randomRGBA());
    }
  }
  return pixelStream;
}

class FlatArrayPixelStream implements PixelStream {
  private array: number[];
  private width: number;
  private height: number;
  private size: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height * 4;
    this.array = new Array(this.size);
  }

  private getIndex(x: number, y: number): number {
    return y * this.width + x * 4;
  }

  private checkBounds(x: number, y: number): void {
    if (x >= this.width || y >= this.height) {
      throw new Error(`Pixel out of bounds: (${x}, ${y})`);
    }
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.checkBounds(x, y);

    const index = this.getIndex(x, y);
    this.array[index] = rgba[0];
    this.array[index + 1] = rgba[1];
    this.array[index + 2] = rgba[2];
    this.array[index + 3] = rgba[3];
    return rgba;
  }

  getPixel(x: number, y: number): RGBA {
    this.checkBounds(x, y);

    const index = this.getIndex(x, y);
    return [
      this.array[index],
      this.array[index + 1],
      this.array[index + 2],
      this.array[index + 3],
    ];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    }
  }
}

class ArrayOfArraysPixelStream implements PixelStream {
  private array: RGBA[];
  private width: number;
  private height: number;
  private size: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.array = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.array[i] = new Array(4) as RGBA;
    }
  }

  private getIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  private checkBounds(x: number, y: number): void {
    if (x >= this.width || y >= this.height) {
      throw new Error(`Pixel out of bounds: (${x}, ${y})`);
    }
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.checkBounds(x, y);

    const index = this.getIndex(x, y);
    this.array[index][0] = rgba[0];
    this.array[index][1] = rgba[1];
    this.array[index][2] = rgba[2];
    this.array[index][3] = rgba[3];
    return rgba;
  }

  getPixel(x: number, y: number): RGBA {
    this.checkBounds(x, y);

    const index = this.getIndex(x, y);
    return this.array[index];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    }
  }
}

class ArrayOfObjectsPixelStream implements PixelStream {
  private array: RGBAObject[];
  private width: number;
  private height: number;
  private size: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.array = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.array[i] = { r: 0, g: 0, b: 0, a: 0 };
    }
  }

  private getIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  private checkBounds(x: number, y: number): void {
    if (x >= this.width || y >= this.height) {
      throw new Error(`Pixel out of bounds: (${x}, ${y})`);
    }
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.checkBounds(x, y);
    const index = this.getIndex(x, y);
    this.array[index].r = rgba[0];
    this.array[index].g = rgba[1];
    this.array[index].b = rgba[2];
    this.array[index].a = rgba[3];
    return rgba;
  }

  getPixel(x: number, y: number): RGBA {
    this.checkBounds(x, y);
    const index = this.getIndex(x, y);
    return [
      this.array[index].r,
      this.array[index].g,
      this.array[index].b,
      this.array[index].a,
    ];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    }
  }
}

class TypedArrayPixelStream implements PixelStream {
  private array: Uint8Array;
  private width: number;
  private height: number;
  private size: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height * 4;
    this.array = new Uint8Array(this.size);
  }

  private getIndex(x: number, y: number): number {
    return y * this.width + x * 4;
  }

  private checkBounds(x: number, y: number): void {
    if (x >= this.width || y >= this.height) {
      throw new Error(`Pixel out of bounds: (${x}, ${y})`);
    }
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.checkBounds(x, y);
    const index = this.getIndex(x, y);
    this.array[index] = rgba[0];
    this.array[index + 1] = rgba[1];
    this.array[index + 2] = rgba[2];
    this.array[index + 3] = rgba[3];
    return rgba;
  }

  getPixel(x: number, y: number): RGBA {
    this.checkBounds(x, y);
    const index = this.getIndex(x, y);
    return [
      this.array[index],
      this.array[index + 1],
      this.array[index + 2],
      this.array[index + 3],
    ];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    }
  }
}

// Бенчмарк

type Mode = "RowMajor" | "ColMajor";

function testPixelStream(width: number, height: number): void {
  const results: [string, Mode, number][] = [];

  const classes = [
    FlatArrayPixelStream,
    ArrayOfArraysPixelStream,
    ArrayOfObjectsPixelStream,
    TypedArrayPixelStream,
  ];

  for (let PixelStreamClass of classes) {
    globalThis.gc?.();
    const pixelStream = generatePixelStream(width, height, PixelStreamClass);

    // Прогрев JIT
    for (let i = 0; i < 10; i++) {
      pixelStream.forEach(TraverseMode.RowMajor, (rgba, x, y) => {});
      pixelStream.forEach(TraverseMode.ColMajor, (rgba, x, y) => {});
    }

    globalThis.gc?.();
    let start = performance.now();
    let end = 0;

    // Чтение по строкам
    pixelStream.forEach(TraverseMode.RowMajor, (rgba, x, y) => {});
    end = performance.now() - start;
    results.push([PixelStreamClass.name, "RowMajor", end]);

    globalThis.gc?.();
    start = performance.now();

    // Чтение по столбцам
    pixelStream.forEach(TraverseMode.ColMajor, (rgba, x, y) => {});
    end = performance.now() - start;
    results.push([PixelStreamClass.name, "ColMajor", end]);
  }

  results.sort((a, b) => a[2] - b[2]);
  console.table(results);
  console.log("-".repeat(80));
}

testPixelStream(100, 100);

testPixelStream(1000, 1000);

testPixelStream(2000, 2000);

testPixelStream(4000, 4000);
