# Бенчмарк обхода пиксельных потоков

Измеряется время (мс) одного полного прохода `forEach` по всем пикселям. Результаты отсортированы по возрастанию времени.

Запуск: `npm run build && npm run start` (требуется `node --expose-gc`).

## 100 × 100

| Реализация                | Обход    | Время (мс) |
| ------------------------- | -------- | ---------- |
| ArrayOfArraysPixelStream  | RowMajor | 0.18       |
| ArrayOfArraysPixelStream  | ColMajor | 0.18       |
| FlatArrayPixelStream      | ColMajor | 0.23       |
| FlatArrayPixelStream      | RowMajor | 0.24       |
| TypedArrayPixelStream     | ColMajor | 0.32       |
| ArrayOfObjectsPixelStream | RowMajor | 0.34       |
| TypedArrayPixelStream     | RowMajor | 0.38       |
| ArrayOfObjectsPixelStream | ColMajor | 0.47       |

**Вывод:** На маленьком изображении лидирует **ArrayOfArraysPixelStream**; разница между RowMajor и ColMajor минимальна (оба ~0.18 мс). **ArrayOfObjectsPixelStream** с обходом по столбцам заметно медленнее остальных.

## 1000 × 1000

| Реализация                | Обход    | Время (мс) |
| ------------------------- | -------- | ---------- |
| ArrayOfArraysPixelStream  | RowMajor | 4.21       |
| ArrayOfArraysPixelStream  | ColMajor | 6.46       |
| FlatArrayPixelStream      | RowMajor | 7.27       |
| TypedArrayPixelStream     | RowMajor | 7.39       |
| TypedArrayPixelStream     | ColMajor | 7.70       |
| FlatArrayPixelStream      | ColMajor | 9.33       |
| ArrayOfObjectsPixelStream | RowMajor | 14.29      |
| ArrayOfObjectsPixelStream | ColMajor | 82.79      |

**Вывод:** Лучшая пара — **ArrayOfArraysPixelStream + RowMajor** (4.21 мс). **RowMajor** быстрее ColMajor у всех реализаций; у **ArrayOfObjects** разрыв особенно велик (ColMajor в ~6 раз медленнее RowMajor). **TypedArray** и **FlatArray** близки по скорости.

## 2000 × 2000

| Реализация                | Обход    | Время (мс) |
| ------------------------- | -------- | ---------- |
| ArrayOfArraysPixelStream  | RowMajor | 17.54      |
| TypedArrayPixelStream     | RowMajor | 27.79      |
| FlatArrayPixelStream      | RowMajor | 28.27      |
| ArrayOfArraysPixelStream  | ColMajor | 29.77      |
| TypedArrayPixelStream     | ColMajor | 31.03      |
| FlatArrayPixelStream      | ColMajor | 42.15      |
| ArrayOfObjectsPixelStream | RowMajor | 64.20      |
| ArrayOfObjectsPixelStream | ColMajor | 532.06     |

**Вывод:** Снова лучший вариант — **ArrayOfArraysPixelStream + RowMajor**. На втором месте **TypedArrayPixelStream + RowMajor**, чуть быстрее **FlatArray + RowMajor**. **ColMajor** у плоского и типизированного массива даёт падение локальности (~1.5×). **ArrayOfObjects + ColMajor** выходит из общего ряда (~30× медленнее RowMajor).

## 4000 × 4000

| Реализация                | Обход    | Время (мс) |
| ------------------------- | -------- | ---------- |
| ArrayOfArraysPixelStream  | RowMajor | 74.53      |
| TypedArrayPixelStream     | RowMajor | 110.69     |
| FlatArrayPixelStream      | RowMajor | 115.85     |
| TypedArrayPixelStream     | ColMajor | 128.64     |
| ArrayOfArraysPixelStream  | ColMajor | 132.95     |
| FlatArrayPixelStream      | ColMajor | 197.91     |
| ArrayOfObjectsPixelStream | RowMajor | 300.73     |
| ArrayOfObjectsPixelStream | ColMajor | 2229.09    |

**Вывод:** На крупном изображении побеждает **ArrayOfArraysPixelStream + RowMajor** (74.5 мс). **TypedArray + RowMajor** обгоняет **FlatArray + RowMajor** (~111 vs ~116 мс). **ColMajor** для FlatArray даёт почти 2× замедление; для ArrayOfObjects — более 7×.

---

## Общие выводы

| Размер    | Лучшая реализация        | Лучший обход                          |
| --------- | ------------------------ | ------------------------------------- |
| 100×100   | ArrayOfArraysPixelStream | RowMajor (практически равен ColMajor) |
| 1000×1000 | ArrayOfArraysPixelStream | RowMajor                              |
| 2000×2000 | ArrayOfArraysPixelStream | RowMajor                              |
| 4000×4000 | ArrayOfArraysPixelStream | RowMajor                              |

1. **Реализация:** **ArrayOfArraysPixelStream** стабильно быстрее всех на любом размере. С ростом картинки **TypedArrayPixelStream** выходит на 2-е место, опережая обычный плоский массив. **ArrayOfObjectsPixelStream** всегда самый медленный.

2. **Обход:** **RowMajor** (по строкам) выигрывает у всех структур, кроме мелкого 100×100, где разница несущественна. Данные хранятся в row-major порядке (`index = y * width + x`), поэтому построчный обход лучше использует кэш CPU; **ColMajor** даёт прыжки по памяти и сильное замедление на больших размерах, особенно у объектов.

3. **Почему ArrayOfArrays быстрее:** при `getPixel` возвращается ссылка на готовый кортеж `RGBA` из массива без копирования четырёх чисел, в отличие от FlatArray/TypedArray, которые каждый раз создают новый массив из 4 элементов.

4. **Почему ArrayOfObjects + ColMajor катастрофичен:** обход по столбцам + создание нового массива в `getPixel` + доступ к полям объекта дают плохую локальность и лишние аллокации; на 4000×4000 это ~30× медленнее RowMajor для той же реализации.
