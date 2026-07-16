# Роль: Spiritualist

**job (localStorage):** `"spiritualist"`
**ROLES.spiritualist** = `"spiritualist"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Dashboard | `/platform/dashboard` |
| 2 | Kalendar | `/platform/calendar` |
| 3 | O'quvchilar | `/platform/students/*` |
| 4 | O'qituvchilar | `/platform/teacher/*` |
| 5 | Sinflar | `/platform/groups/*` |
| 6 | Time Table | `/platform/time/*` |
| 7 | TeacherStatistics | `/platform/teacherStatistics` |
| 8 | Teacher observe statistics | `/platform/observation_results` |
| 9 | Xo'jalik uchun zayavka | `/platform/applicationSystem` |

> Spiritualist **не имеет** доступа к Todoist — его нет в списке ролей для этого меню.

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек | ✅ |
| Кнопка назад | ✅ |
| Переключатель филиала (Location) | ❌ |

Привязан к своему `branchId`.

---

## Страницы

---

### 1. Dashboard

**Путь:** `/platform/dashboard`
**Файл:** `src/pages/directorDashboardPage/ui/directorDashboardPage.jsx`
**Общая с ролями:** director, main_director, accountant

#### Вкладки Dashboard для spiritualist

**Строки:** `directorDashboardPage.jsx:252-256`

| Вкладка | Spiritualist |
|---------|:------------:|
| Dashboard | ❌ — строка `:252` |
| Moliyaviy statistika | ❌ — строка `:253` |
| **Kunlik Dars Rejasi Hisoboti** | ✅ |

```js
{job === "spiritualist" || job === "accountant" ? "" : <Button>Dashboard</Button>}
{job === "spiritualist" ? "" : <Button>Moliyaviy statistika</Button>}
{job === "accountant" ? "" : <Button>Kunlik Dars Rejasi Hisoboti</Button>}
```

Spiritualist видит **только** вкладку "Kunlik Dars Rejasi Hisoboti". Начальное состояние:
```js
useState(job === "spiritualist" ? "Kunlik Dars Rejasi Hisoboti" : ...)
```

---

### 2. Kalendar

**Путь:** `/platform/calendar`
**Файл:** `src/pages/calendarPage/`
**Общая с ролями:** advertising

---

### 3. O'quvchilar (Студенты)

**Путь:** `/platform/students/*`
**Файл:** `src/pages/studentsPage/ui/studentsAdminPage/studentsPage.jsx`
**Общая с ролями:** admin, programmer, zavuch, advertising

#### Вкладки — ограничение для spiritualist

Spiritualist видит **только 2 вкладки** (New Students скрыт):
- Studying Students
- Deleted Students

**Строки:** `studentsPage.jsx:109` и `:326`
```js
job === "spiritualist" ? studentsFilter2 : ...
// studentsFilter2 = [{name: "studying_students"}, {name: "deleted_students"}]
```

#### Навигация из O'quvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `/students/RGBData` | Кнопка "RB-Baza" | `studentsHeader.jsx:53` |
| `/students/attendance` | Кнопка "Davomat" | `studentsHeader.jsx:59` |
| Student Profile | Клик на студента | через список |

---

### 3а. Student Profile — ограничения для spiritualist

#### Секция оплаты/баланса

**Файл:** `src/entities/profile/studentProfile/ui/studentProfileInfo/studentProfileInfo.jsx:211`

```js
role === "advertising" ? null :
role === "spiritualist" ? (
    <div>
        <span title={"To'lov qilish"} className={cls.clicker}></span>  {/* нет onClick! */}
        <h1 title={"To'lovlar ro'yxati"}>{formattedNumber} so'm</h1>    {/* нет onClick! */}
        <img src={visa} />
    </div>
) :
<div>
    <span onClick={() => setActive("balanceIn")}>  {/* кнопка оплаты */}
    <h1 onClick={() => setActive("balance")}>       {/* список платежей */}
</div>
```

Для spiritualist: баланс **виден** (сумма отображается), но кнопки **не кликабельны** — `onClick` отсутствует. Оплатить или открыть список платежей нельзя.

#### Контракт (Shartnoma) — ограничения для spiritualist

**Файл:** `src/entities/profile/studentProfile/ui/studentProfileContract/studentProfileContract.jsx`

| Элемент | Spiritualist | Другие роли |
|---------|:-----------:|:-----------:|
| Форма данных контракта | ✅ | ✅ |
| Кнопка "Tasdiqlash" | ❌ — строка `:101` | ✅ |
| Файловый загрузчик | ✅ | ✅ |
| Кнопка "Yuklash" | ❌ — строка `:126` | ✅ |

```js
{job === "spiritualist" ? "" : <Button>Tasdiqlash</Button>}
{job === "spiritualist" ? "" : <Button>Yuklash</Button>}
```

---

### 4. O'qituvchilar (Учителя)

**Путь:** `/platform/teacher/*`
**Общая с ролями:** admin, programmer

#### Навигация

| Куда | Как |
|------|-----|
| Teacher Profile | Клик на учителя |

#### Teacher Profile — для spiritualist

**Файл:** `src/entities/profile/teacherProfile/ui/teacherProfileInfo/teacherProfileInfo.jsx:107`

Кнопка "Balans" → TeacherSalaryPage **НЕ показывается** (только для `"direktor"` / `"director"`).

Карточка Attendance → `../teacherAttendance/:id` доступна (строка `:164`).

---

### 5. Sinflar (Классы)

**Путь:** `/platform/groups/*`
**Общая с ролями:** admin, programmer, teacher, zavuch

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

### 6. Time Table

**Путь:** `/platform/time/*`
**Файл:** `src/pages/timeTable/ui/TimeTableTuronPage/TimeTableTuronPage.jsx`
**Общая с ролями:** admin, programmer, zavuch

Spiritualist **не имеет** ограничений как admin. Полный доступ:

| Функция | Spiritualist |
|---------|:------------:|
| Class/Flow кнопки | ✅ |
| Full Screen | ✅ |
| Drag & Drop | ✅ |
| ClassView с X кнопкой | ✅ |

---

### 7. TeacherStatistics

**Путь:** `/platform/teacherStatistics`
**Файл:** `src/pages/teacherStatisticsPage/ui/teacherStatisticsPage.jsx`
**Только для spiritualist**

Branch-фильтр (`teacherStatisticsPage.jsx:30`): использует `branchId` (не `currentBranch`).

---

### 8. Teacher observe statistics

**Путь:** `/platform/observation_results`
**Только для spiritualist**

---

### 9. Xo'jalik uchun zayavka

**Путь:** `/platform/applicationSystem`
**Общая с ролями:** admin, director, main_director, advertising
