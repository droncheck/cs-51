export class RingBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.array = new Float64Array(capacity);
    this.head = capacity - 1;
    this.tail = 0;
  }

  push(value) {
    if (this.size === this.capacity) {
      throw new Error("Buffer is full");
    }

    this.array[this.tail] = value;
    this.tail += 1;
    if (this.tail === this.capacity) this.tail = 0;
    this.size += 1;
  }

  pop() {
    if (this.size === 0) throw new Error("Buffer is empty");
    this.tail -= 1;
    if (this.tail < 0) this.tail = this.capacity - 1;
    this.size -= 1;
    return this.array[this.tail];
  }

  unshift(value) {
    if (this.size === this.capacity) {
      throw new Error("Buffer is full");
    }

    this.array[this.head] = value;
    this.head -= 1;
    if (this.head < 0) this.head = this.capacity - 1;
    this.size += 1;
  }

  shift() {
    if (this.size === 0) throw new Error("Buffer is empty");
    this.head += 1;
    if (this.head === this.capacity) this.head = 0;
    this.size -= 1;
    return this.array[this.head];
  }
}
