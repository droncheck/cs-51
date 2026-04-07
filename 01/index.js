const NumberPrefix = 0;
const UppercasePrefix = 2;
const LowercasePrefix = 1;
const PunctuationPrefix = 3;

const ExtraTable = {
  10: "Ё",
  11: "ё",
  12: " ",
  13: "\t",
  14: "\n",
  15: "\r",
};

const LetterTable = {
  0: ["А", "а"],
  1: ["Б", "б"],
  2: ["В", "в"],
  3: ["Г", "г"],
  4: ["Д", "д"],
  5: ["Е", "е"],
  6: ["Ж", "ж"],
  7: ["З", "з"],
  8: ["И", "и"],
  9: ["Й", "й"],
  10: ["К", "к"],
  11: ["Л", "л"],
  12: ["М", "м"],
  13: ["Н", "н"],
  14: ["О", "о"],
  15: ["П", "п"],
  16: ["Р", "р"],
  17: ["С", "с"],
  18: ["Т", "т"],
  19: ["У", "у"],
  20: ["Ф", "ф"],
  21: ["Х", "х"],
  22: ["Ц", "ц"],
  23: ["Ч", "ч"],
  24: ["Ш", "ш"],
  25: ["Щ", "щ"],
  26: ["Ъ", "ъ"],
  27: ["Ы", "ы"],
  28: ["Ь", "ь"],
  29: ["Э", "э"],
  30: ["Ю", "ю"],
  31: ["Я", "я"],
};

const PunctuationTable = {
  0: ".",
  1: ",",
  2: ";",
  3: ":",
  4: "!",
  5: "?",
  6: "«",
  7: "»",
  8: "—",
  9: "-",
  10: "(",
  11: ")",
  12: "…",
  13: '"',
  14: "'",
  15: "№",
  16: "%",
  17: "*",
  18: "+",
  19: "=",
  20: "<",
  21: ">",
  22: "@",
  23: "#",
  24: "&",
  25: "[",
  26: "]",
  27: "{",
  28: "}",
  29: "/",
  30: "\\",
};

function decodeByte(byte) {
  const prefix = byte >>> 6;
  let suffix = (byte << 27) >>> 27;

  switch (prefix) {
    case NumberPrefix:
      suffix = (byte << 28) >>> 28;
      return ExtraTable[suffix] || suffix;
    case UppercasePrefix:
      return LetterTable[suffix][0];
    case LowercasePrefix:
      return LetterTable[suffix][1];
    case PunctuationPrefix:
      return PunctuationTable[suffix] || "";
  }
}

function encodeChar(char) {
  let num;
  let prefix;

  for (const [key, value] of Object.entries(LetterTable)) {
    if (value[0] === char) {
      num = key;
      prefix = UppercasePrefix;
      break;
    }

    if (value[1] === char) {
      num = key;
      prefix = LowercasePrefix;
      break;
    }
  }

  for (const [key, value] of Object.entries(PunctuationTable)) {
    if (value === char) {
      num = key;
      prefix = PunctuationPrefix;
      break;
    }
  }

  for (const [key, value] of Object.entries(ExtraTable)) {
    if (value === char) {
      num = key;
      prefix = NumberPrefix;
      break;
    }
  }

  if (num === undefined) {
    if (isNaN(Number(char))) {
      throw new Error("Invalid character");
    }

    num = Number(char);
    prefix = NumberPrefix;
  }

  return (prefix << 6) | num;
}

function encode(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = encodeChar(str[i]);
  }
  return bytes;
}

function decode(bytes) {
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += decodeByte(bytes[i]);
  }
  return str;
}

console.log(encode("АБВ"));
console.log(encode("абв"));
console.log(encode("123"));
console.log(encode("Привет! )) @#%@ Меня зовут Андрей!!! ((     13424342"));
console.log(decode(encode("АБВ")));
console.log(decode(encode("абв")));
console.log(decode(encode("123")));
console.log(
  decode(encode("Привет! )) @#%@ Меня зовут Андрей!!! ((     13424342")),
);
