# Роль: Zavuch

**job (localStorage):** `"Zavuch"` *(с заглавной Z)*
**ROLES.zavuch** = `"Zavuch"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | O'quvchilar | `/platform/students/*` |
| 2 | Sinflar | `/platform/groups/*` |
| 3 | Time Table | `/platform/time/*` |

> Zavuch **не имеет** доступа к Todoist — его нет в списке ролей для этого меню.

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек | ✅ |
| Кнопка назад | ✅ |
| Переключатель филиала | ❌ |

---

## Страницы

---

### 1. O'quvchilar (Студенты)

**Путь:** `/platform/students/*`
**Общая с ролями:** admin, programmer, spiritualist, advertising

#### Вкладки

Zavuch видит **все 3 вкладки** (как admin/programmer):
- New Students
- Studying Students
- Deleted Students

**Строка:** `studentsPage.jsx:109` — zavuch не упомянут в исключениях, попадает в ветку по умолчанию.

#### Навигация из O'quvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `/students/RGBData` | Кнопка "RB-Baza" | `studentsHeader.jsx:53` |
| `/students/attendance` | Кнопка "Davomat" | `studentsHeader.jsx:59` |
| Excel экспорт | `<a href="...">` | `studentsHeader.jsx:66` |
| Student Profile | Клик на студента | через список |

#### Student Profile — для zavuch

- Секция оплаты: **полная** (нет ограничений для zavuch)
- Контракт: кнопки "Tasdiqlash" и "Yuklash" доступны

---

### 2. Sinflar (Классы)

**Путь:** `/platform/groups/*`
**Общая с ролями:** admin, programmer, teacher, spiritualist

#### Навигация из Sinflar

| Куда | Кнопка | Файл:Строка |
|------|--------|-------------|
| `groups/quarter` | "Chorak baholari" | `groupsPage.jsx:166` |
| `groups/groupRating` | "Sinflar reytinggi" | `groupsPage.jsx:172` |
| `../class` | "Sinf raqamlari" | `groupsPage.jsx:178` |
| `../timeList` | "Time List" | `groupsPage.jsx:185` |
| `groups/exams` | "Imtihonlar" | `groupsPage.jsx:192` |
| `groups/groupInfo/:id` | Клик на группу | список |

#### Group Profile навигация

| Куда | Файл:Строка |
|------|-------------|
| `groupInfo/:id/quarter/:id` | `groupProfileInfoForm.jsx:143` |
| `groupInfo/:id/grades` | `groupProfileInfoForm.jsx:158` |
| `groupInfo/:id/lessonTable/:id` | `groupProfileInfoForm.jsx:202` |
| `groupInfo/:id/reyting/:id` | `groupProfileInfoForm.jsx:211` |
| `groupInfo/:id/attendance` | через вкладку |
| `students/profile/:id` | `groupQuarterTable.jsx:24` |

---

### 3. Time Table

**Путь:** `/platform/time/*`
**Общая с ролями:** admin, programmer, spiritualist

Zavuch **не имеет** ограничений как admin. Полный доступ:

| Функция | Zavuch |
|---------|:------:|
| Class/Flow кнопки | ✅ |
| Full Screen | ✅ |
| Drag & Drop | ✅ |
| ClassView с X кнопкой | ✅ |

Ограничения Time Table (`job === "admin"`) не применяются к zavuch.
