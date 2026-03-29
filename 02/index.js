const instructions = {
  "SET A": 0,
  "PRINT A": 1,
  "IFN A": 2,
  RET: 3,
  "DEC A": 4,
  JMP: 5,
};

const program = [
  // Ставим значения аккумулятора
  instructions["SET A"],
  // В 10
  10,

  // Выводим значение на экран
  instructions["PRINT A"],

  // Если A равно 0
  instructions["IFN A"],

  // Программа завершается
  instructions["RET"],

  // И возвращает 0
  0,

  // Уменьшаем A на 1
  instructions["DEC A"],

  // Устанавливаем курсор выполняемой инструкции
  instructions["JMP"],

  // В значение 2
  2,
];

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
const result = execute(program);
console.log(result);

function getInstructionName(instruction) {
  return Object.keys(instructions).find(
    (key) => instructions[key] === instruction,
  );
}

function execute(program) {
  let a;
  let p = 0;

  // Проходим по программе и создаем команды для выполнения - массив массивов, где первый элемент - команда, второй - аргумент
  const commands = [];
  while (p < program.length) {
    switch (program[p]) {
      case instructions["SET A"]:
      case instructions["RET"]:
      case instructions["JMP"]:
        if (p + 1 >= program.length) {
          throw new Error(
            `Instruction ${getInstructionName(program[p])} requires an argument`,
          );
        }

        commands.push([program[p], program[p + 1]]);
        // Трюк для сохранения адресации
        commands.push([-1]);
        p += 2;
        break;
      default:
        // Если аргумента нет, то добавляем массив с одной лишь командой
        commands.push([program[p]]);
        p += 1;
    }
  }

  p = 0;

  while (true) {
    if (p >= commands.length) {
      throw new Error("Program ended unexpectedly");
    }

    switch (commands[p][0]) {
      case -1:
        p += 1;
        break;
      case instructions["SET A"]:
        a = commands[p][1];
        p += 1;
        break;
      case instructions["DEC A"]:
        a -= 1;
        p += 1;
        break;
      case instructions["PRINT A"]:
        console.log(a);
        p += 1;
        break;
      case instructions["IFN A"]:
        if (a === 0) {
          p += 1;
        } else {
          p += 2;
        }
        break;
      case instructions["JMP"]:
        p = commands[p][1];
        break;
      case instructions["RET"]:
        return commands[p][1];
      default:
        throw new Error(`Unknown instruction: ${commands[p][0]}`);
    }
  }
}
