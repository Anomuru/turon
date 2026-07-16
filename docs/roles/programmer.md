# Роль: Programmer

**job (localStorage):** `"programmer"`
**ROLES.programmer** = `"programmer"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Registratsiya | `/platform/register` |
| 2 | Statistika | `/platform/Statistics/` |
| 3 | Todoist | `/platform/todoist/*` |
| 4 | O'quvchilar | `/platform/students/*` |
| 5 | O'qituvchilar | `/platform/teacher/*` |
| 6 | Sinflar | `/platform/groups/*` |
| 7 | Time Table | `/platform/time/*` |
| 8 | Capital | `/platform/capital/:id` |
| 9 | Buxgalteriya | `/platform/accounting/*` |
| 10 | Zavxoz profile | `/platform/quarterMaster` |

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек | ✅ |
| Кнопка назад | ✅ |
| Переключатель филиала (Location) | ❌ |

Programmer привязан к своему `branchId`.

---

## Страницы

---

### 1. Registratsiya

**Путь:** `/platform/register`
**Общая с ролями:** admin, director, main_director

---

### 2. Statistika

**Путь:** `/platform/Statistics/`
**Файл:** `src/pages/statisticsPage/ui/statisticsPage.jsx`
**Общая с ролями:** director, main_director

Branch-фильтр (`statisticsPage.jsx:37`): programmer использует свой `branchId` (не `currentBranch`).

---

### 3. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, main_director, accountant, teacher, methodist, muxarir, operator, smm, zavxos

---

### 4. O'quvchilar (Студенты)

**Путь:** `/platform/students/*`
**Файл:** `src/pages/studentsPage/ui/studentsAdminPage/studentsPage.jsx`
**Общая с ролями:** admin, zavuch, spiritualist, advertising

#### Вкладки

Programmer видит **все 3 вкладки** (как admin):
- New Students
- Studying Students
- Deleted Students

**Строка:** `studentsPage.jsx:109`

#### Навигация из O'quvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `/students/RGBData` | Кнопка "RB-Baza" | `studentsHeader.jsx:53` |
| `/students/attendance` | Кнопка "Davomat" | `studentsHeader.jsx:59` |
| Excel экспорт | `<a href="...">` | `studentsHeader.jsx:66` |
| Student Profile (`/students/profile/:id`) | Клик на студента | через список |

#### Student Profile — доступ программиста

- Секция оплаты: **полная** (admin и programmer получают одинаковый доступ)
- Контракт: кнопки "Tasdiqlash" и "Yuklash" доступны

---

### 5. O'qituvchilar (Учителя)

**Путь:** `/platform/teacher/*`
**Общая с ролями:** admin, spiritualist

#### Навигация

| Куда | Как |
|------|-----|
| Teacher Profile (`/teacher/teacherProfile/:id`) | Клик на учителя |

#### Teacher Profile — доступ программиста

**Файл:** `src/entities/profile/teacherProfile/ui/teacherProfileInfo/teacherProfileInfo.jsx:107`
```js
(role === "direktor" || role === "director") && <Button>Balans</Button>
```

Programmer (`"programmer"`) — кнопка "Balans" **НЕ показывается**.

Доступна карточка Attendance → `../teacherAttendance/:id` (строка `:164`).

---

### 6. Sinflar (Классы)

**Путь:** `/platform/groups/*`
**Файл:** `src/pages/groupsPage/ui/groupsPage/groupsPage.jsx`
**Общая с ролями:** admin, teacher, zavuch, spiritualist

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

Нет role-специфических ограничений внутри Sinflar/Group Profile для programmer.

---

### 7. Time Table

**Путь:** `/platform/time/*`
**Файл:** `src/pages/timeTable/ui/TimeTableTuronPage/TimeTableTuronPage.jsx`
**Общая с ролями:** admin, zavuch, spiritualist

Programmer **не имеет ограничений** в Time Table (ограничения только для `admin`):

| Функция | Programmer | Admin |
|---------|:----------:|:-----:|
| Class/Flow кнопки | ✅ | ❌ |
| Full Screen | ✅ | ❌ |
| Drag & Drop (TimeTableDragItems) | ✅ | ❌ |
| ClassView (X кнопка) | ✅ | ❌ |
| Автовход в ClassView | ❌ | ✅ (принудительно) |

Programmer имеет **полный доступ** к редактированию расписания.

---

### 8. Capital

**Путь:** `/platform/capital/:id`
**Общая с ролями:** admin, director, main_director, accountant

#### Навигация

| Куда | Как |
|------|-----|
| `/capital/capitalBoxProfile/:id` | Клик на кассу |
| `/capital/capitalBoxProfile/:id/profile/:id` | Из CapitalInside |

---

### 9. Buxgalteriya

**Путь:** `/platform/accounting/*`
**Общая с ролями:** admin, director, main_director

#### Навигация

| Куда | Файл:Строка |
|------|-------------|
| Профиль студента/учителя | `accountingPageNewTable.jsx:173` |
| Overhead log | `accountingPageNewTable.jsx:195` |
| `/inkasatsiya/:id` | роутинг |
| `/accounting/otchot/*` | роутинг |
| `/accounting/overheadTypes` | роутинг |
| `/accounting/loanProfile/:id` | роутинг |

---

### 10. Zavxoz profile

**Путь:** `/platform/quarterMaster`
**Общая с ролями:** director, main_director, zavxos
