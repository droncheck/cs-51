import { RingBuffer } from "./buffer.js";

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSMI() {
  return randomNumber(0, 2 ** 30 - 1);
}

function randomDouble() {
  return randomNumber(2 ** 30, 2 ** 53 - 1);
}

function generatePackedSmiArray(length) {
  const array = new Array(length).fill(0).map(randomSMI);
  return array;
}

function generatePackedDoubleArray(length) {
  const array = new Array(length).fill(0).map(randomDouble);
  return array;
}

function generatePackedArray(length) {
  const array = new Array(length - 1).fill(0).map(randomDouble);
  array.push("");
  return array;
}

function generateHoleySmiArray(length) {
  const array = new Array(length).fill(randomSMI());
  return array;
}

function generateHoleyDoubleArray(length) {
  const array = new Array(length).fill(randomDouble());
  return array;
}

function generateHoleyArray(length) {
  const array = new Array(length - 1).fill(randomDouble());
  array.push("");
  return array;
}

function generateRingBuffer(length) {
  const array = new RingBuffer(length);
  return array;
}

function testArrayOperations(array, arrayType, randomFunction) {
  const results = [];

  // Прогрев JIT
  for (let i = 0; i < 1000; i++) {
    array.push(randomFunction());
    array.unshift(randomFunction());
    array.pop();
    array.shift();
  }

  globalThis.gc?.();
  let start = performance.now();
  let end = 0;

  // push
  array.push(randomFunction());
  end = performance.now() - start;
  results.push([arrayType, "push", end]);

  // unshift
  globalThis.gc?.();
  start = performance.now();
  array.unshift(randomFunction());
  end = performance.now() - start;
  results.push([arrayType, "unshift", end]);

  // pop
  globalThis.gc?.();
  start = performance.now();
  array.pop();
  end = performance.now() - start;
  results.push([arrayType, "pop", end]);

  // shift
  globalThis.gc?.();
  start = performance.now();
  array.shift();
  end = performance.now() - start;
  results.push([arrayType, "shift", end]);

  console.table(results);
  console.log("-".repeat(80));
}

function runTests(length) {
  console.log(`${length} ELEMENTS`);
  console.log("-".repeat(80));
  testArrayOperations(
    generatePackedSmiArray(length),
    "PACKED_SMI_ELEMENTS",
    randomSMI,
  );
  testArrayOperations(
    generatePackedDoubleArray(length),
    "PACKED_DOUBLE_ELEMENTS",
    randomDouble,
  );
  testArrayOperations(
    generatePackedArray(length),
    "PACKED_ELEMENTS",
    randomDouble,
  );
  testArrayOperations(
    generateHoleySmiArray(length),
    "HOLEY_SMI_ELEMENTS",
    randomSMI,
  );
  testArrayOperations(
    generateHoleyDoubleArray(length),
    "HOLEY_DOUBLE_ELEMENTS",
    randomDouble,
  );
  testArrayOperations(
    generateHoleyArray(length),
    "HOLEY_ELEMENTS",
    randomDouble,
  );
  testArrayOperations(generateRingBuffer(length), "RING_BUFFER", randomDouble);
}

runTests(100);
runTests(1_000);
runTests(1_000_000);
