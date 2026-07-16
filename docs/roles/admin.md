# Роль: Admin

**job (localStorage):** `"admin"`
**ROLES.admin** = `"admin"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Registratsiya | `/platform/register` |
| 2 | **Operator Tasks** *(только admin)* | `/platform/adminTaskManager` |
| 3 | Todoist | `/platform/todoist/*` |
| 4 | O'quvchilar | `/platform/students/*` |
| 5 | O'qituvchilar | `/platform/teacher/*` |
| 6 | Sinflar | `/platform/groups/*` |
| 7 | Time Table | `/platform/time/*` |
| 8 | Capital | `/platform/capital/:id` |
| 9 | Buxgalteriya | `/platform/accounting/*` |
| 10 | Xo'jalik uchun zayavka | `/platform/applicationSystem` |

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

**Файл:** `src/widgets/header/ui/header.jsx`

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек (`/settings`) | ✅ |
| Кнопка назад | ✅ |
| Переключатель филиала (Location) | ❌ — только `main_director` |

**Строка:** `header.jsx:123` — `userRole === "director" ? <Location/> : null`

Admin привязан к своему `branchId` из localStorage. Переключать активный филиал нельзя.

---

## Страницы

---

### 1. Registratsiya

**Путь:** `/platform/register`
**Файл страницы:** `src/pages/registerPage/`
**Общая с ролями:** director, main_director, programmer

Нет role-специфических ограничений внутри страницы.

---

### 2. Operator Tasks

**Путь:** `/platform/adminTaskManager`
**Файл страницы:** `src/pages/adminTaskManager/`
**Только для admin** — единственная роль с доступом к этому разделу.

Нет role-специфических ограничений внутри страницы.

---

### 3. Todoist

**Путь:** `/platform/todoist/*`
**Файл страницы:** `src/pages/todoistPage/`
**Общая с ролями:** director, main_director, programmer, accountant, teacher, methodist, muxarir, operator, smm, zavxos

Нет role-специфических ограничений внутри страницы.

---

### 4. O'quvchilar (Студенты)

**Путь:** `/platform/students/*`
**Файл страницы:** `src/pages/studentsPage/ui/studentsAdminPage/studentsPage.jsx`
**Общая с ролями:** programmer, zavuch, spiritualist, advertising

#### Вкладки (фильтры студентов)

Admin видит **все 3 вкладки**:
- New Students
- Studying Students
- Deleted Students

**Строка:** `studentsPage.jsx:109` и `:326`
```js
// admin попадает в ветку по умолчанию → studentsFilter (все 3 вкладки)
job === "spiritualist" ? studentsFilter2 : job === "advertising" ? studentsFilter3 : studentsFilter
```

#### Навигация из O'quvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `/students/RGBData` (RB-Baza) | Кнопка "RB-Baza" в хедере | `studentsHeader.jsx:53` |
| `/students/attendance` (Davomat) | Кнопка "Davomat" в хедере | `studentsHeader.jsx:59` |
| Excel экспорт | Ссылка `<a href="...">` | `studentsHeader.jsx:66` |
| Student Profile (`/students/profile/:id`) | Клик на строку студента | через `Students` entity |

---

### 4а. Student Profile (Профиль студента)

**Путь:** `/platform/students/profile/:id`
**Файл:** `src/pages/profilePage/ui/studentProfilePage/studentProfilePage.jsx`
**Доступен через:** клик на студента из O'quvchilar

#### Вкладки внутри профиля

Переключаются через `setCurrentTab`, **навигации по URL нет** — всё в рамках одного компонента:

| Вкладка | Действие |
|---------|---------|
| Ma'lumotlar | `setCurrentTab("info")` — строка `studentProfileInfo.jsx:113` |
| Shartnoma | `setCurrentTab("contract")` — строка `studentProfileInfo.jsx:122` |
| Dars jadvalini ko'rish | `setCurrentTab("timetable")` — строка `studentProfileInfo.jsx:131` |
| Chorakni ko'rish | `setCurrentTab("quarter")` — строка `studentProfileInfo.jsx:136` |

#### Секция оплаты/баланса

**Файл:** `src/entities/profile/studentProfile/ui/studentProfileInfo/studentProfileInfo.jsx:211`

```js
role === "advertising" ? null :            // advertising: скрыта полностью
role === "spiritualist" ? <...урезанная> : // spiritualist: без кнопок оплаты
<...полная>                                // все остальные (включая admin): полная секция
```

**Для admin:** секция оплаты видна **полностью** — показывает баланс и кнопки ("To'lov qilish", список платежей).

#### Контракт (Shartnoma)

**Файл:** `src/entities/profile/studentProfile/ui/studentProfileContract/studentProfileContract.jsx`

| Элемент | Admin | Spiritualist |
|---------|:-----:|:------------:|
| Форма контракта | ✅ | ✅ |
| Кнопка "Tasdiqlash" | ✅ | ❌ — строка `:101` |
| Файловый загрузчик | ✅ | ✅ |
| Кнопка "Yuklash" | ✅ | ❌ — строка `:126` |

---

### 5. O'qituvchilar (Учителя)

**Путь:** `/platform/teacher/*`
**Файл страницы:** `src/pages/teacherPage/`
**Общая с ролями:** programmer, spiritualist

#### Навигация из O'qituvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| Teacher Profile (`/teacher/teacherProfile/:id`) | Клик на строку учителя | через `Teachers` entity |

---

### 5а. Teacher Profile (Профиль учителя)

**Путь:** `/platform/teacher/teacherProfile/:id`
**Файл:** `src/pages/profilePage/ui/profileTeacherPage/profileTeacherPage.jsx`
**Компонент инфо:** `src/entities/profile/teacherProfile/ui/teacherProfileInfo/teacherProfileInfo.jsx`

#### Кнопки в профиле учителя

| Элемент | Admin | Director / Main_director |
|---------|:-----:|:------------------------:|
| Кнопка "O'qituvchi" (info tab) | ✅ | ✅ |
| Кнопка Fan (предмет) | ✅ | ✅ |
| Кнопка **"Balans"** → TeacherSalaryPage | ❌ | ✅ |
| Кнопка "Time table" tab | ✅ | ✅ |
| Карточка "Attendance" → `/teacherAttendance/:id` | ✅ | ✅ |

**Строка ограничения:** `teacherProfileInfo.jsx:107`
```js
(role === "direktor" || role === "director") && <Button onClick={() => navigate(`teacherSalaryPage/${teacherId?.id}`)}>Balans</Button>
```

**Для admin:** кнопка "Balans" отсутствует → страницы `TeacherSalaryPage` и `GiveTeacherSalaryPage` через UI недоступны.

**Строка Attendance:** `teacherProfileInfo.jsx:164`
```js
<div onClick={() => navigate(`../teacherAttendance/${teacherId.id}`)}>
```

---

### 6. Sinflar (Классы/Группы)

**Путь:** `/platform/groups/*`
**Файл страницы:** `src/pages/groupsPage/ui/groupsPage/groupsPage.jsx`
**Общая с ролями:** programmer, teacher, zavuch, spiritualist

#### Навигация из Sinflar

| Куда | Кнопка | Файл:Строка |
|------|--------|-------------|
| `groups/quarter` — Chorak baholari | "Chorak baholari" | `groupsPage.jsx:166` |
| `groups/groupRating` — Sinflar reytinggi | "Sinflar reytinggi" | `groupsPage.jsx:172` |
| `../class` — Sinf raqamlari | "Sinf raqamlari" | `groupsPage.jsx:178` |
| `../timeList` — Time List | "Time List" | `groupsPage.jsx:185` |
| `groups/exams` — Imtihonlar | "Imtihonlar" | `groupsPage.jsx:192` |
| `groups/groupInfo/:id` — Group Profile | Клик на строку группы | через список групп |

---

### 6а. Group Profile (Профиль группы)

**Путь:** `/platform/groups/groupInfo/:id`
**Файл компонента:** `src/features/groupProfile/ui/groupProfileInfoForm/groupProfileInfoForm.jsx`

#### Навигация из Group Profile

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `groupInfo/:id/quarter/:id` | Кнопка "Chorak" | `groupProfileInfoForm.jsx:143` |
| `groupInfo/:id/grades` | Кнопка "Grades" | `groupProfileInfoForm.jsx:158` |
| `groupInfo/:id/lessonTable/:id` | Карточка "Lesson Table" | `groupProfileInfoForm.jsx:202` |
| `groupInfo/:id/reyting/:id` | Карточка "Reyting" | `groupProfileInfoForm.jsx:211` |
| `groupInfo/:id/attendance` | Вкладка посещаемости | через GroupAttendance |
| `students/profile/:id` | Клик на студента в четверти | `groupQuarterTable.jsx:24` |

Нет role-специфических ограничений внутри Group Profile для admin.

---

### 7. Time Table

**Путь:** `/platform/time/*`
**Файл страницы:** `src/pages/timeTable/ui/TimeTableTuronPage/TimeTableTuronPage.jsx`
**Файл фильтров:** `src/pages/timeTable/ui/TimeTableTuronPageFilters/TimeTableTuronPageFilters.jsx`
**Общая с ролями:** programmer, zavuch, spiritualist

#### Ограничения для admin — самые жёсткие из всех ролей

**1. Автоматическое переключение в ClassView**
**Файл:Строка:** `TimeTableTuronPage.jsx:152`
```js
if (job === "admin") {
    setClassView(true)
}
```
При открытии страницы admin автоматически видит только ClassView — сетку расписания.

**2. Нет панели перетаскивания предметов**
**Файл:Строка:** `TimeTableTuronPage.jsx:905`
```js
job === "admin" ? null : <TimeTableDragItems ... />
```
Admin не может редактировать расписание методом drag-and-drop.

**3. Нет кнопок Class/Flow**
**Файл:Строка:** `TimeTableTuronPageFilters.jsx:156`
```js
job === "admin" ? null : <><Button>Class</Button><Button>Flow</Button></>
```

**4. Нет кнопки Full Screen**
**Файл:Строка:** `TimeTableTuronPageFilters.jsx:179`
```js
job === "admin"
    ? <Button onClick={() => setClassView(true)}>Class view</Button>
    : <><Button>Class view</Button><Button>Full screen</Button></>
```

**5. Нет кнопки закрытия (X) в ClassView**
**Файл:** `src/entities/timeTableTuron/classView2.0/classView2.0.jsx`
**Строка:** `classView2.0.jsx:388`
```js
job === "admin" ? null : <i onClick={() => setActive(false)} className={"fa fa-times " + cls.closeBtn}/>
```
Admin не может закрыть ClassView — он всегда в нём находится.

#### Итог для admin в Time Table

Admin видит **только статичную сетку расписания (ClassView)** без возможности:
- Переключиться на другой вид
- Редактировать расписание
- Открыть полноэкранный режим
- Закрыть ClassView

---

### 8. Capital

**Путь:** `/platform/capital/:id`
**Файл страницы:** `src/pages/capitalPage/`
**Общая с ролями:** director, main_director, programmer, accountant

#### Навигация из Capital

| Куда | Как | Файл |
|------|-----|------|
| `/capital/capitalBoxProfile/:id` (CapitalInside) | Клик на кассу | через Capital entity |
| `/capital/capitalBoxProfile/:id/profile/:id` (CategoryProfile) | Из CapitalInside | `capitalInside.jsx` |

Нет role-специфических ограничений внутри Capital для admin. Закомментированный код `// const ROLE = localStorage.getItem('job')` указывает, что ограничения планировались, но не реализованы (`capitalInside.jsx:102`).

---

### 9. Buxgalteriya (Бухгалтерия)

**Путь:** `/platform/accounting/*`
**Файл страницы:** `src/pages/accountingPage2.0/`
**Общая с ролями:** director, main_director, programmer

#### Навигация из Buxgalteriya

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| Профиль студента / учителя | Клик на имя в таблице платежей | `accountingPageNewTable.jsx:173` |
| Overhead log | Иконка чека в строке платежа | `accountingPageNewTable.jsx:195` |
| `/inkasatsiya/:id` | Через меню бухгалтерии | через роутинг |
| `/accounting/otchot/*` | Через меню бухгалтерии | через роутинг |
| `/accounting/overheadTypes` | Через меню бухгалтерии | через роутинг |
| `/accounting/loanProfile/:id` | Через меню бухгалтерии | через роутинг |

Нет role-специфических ограничений внутри Buxgalteriya для admin.

---

### 10. Xo'jalik uchun zayavka (ApplicationSystem)

**Путь:** `/platform/applicationSystem`
**Файл страницы:** `src/pages/applicationSystem/applicationSystem.jsx`
**Общая с ролями:** director, main_director, spiritualist, advertising

Нет role-специфических ограничений внутри страницы.

---

## Страницы, недоступные через меню

Роутинг не защищён по ролям (`AppRouter.jsx` — нет guard-ов). Следующие страницы технически открываются по прямому URL, но ссылок на них в UI для admin нет:

- `/platform/dashboard`
- `/platform/Statistics/`
- `/platform/educationQuality`
- `/platform/teacherMenu`
- `/platform/schoolMenu`
- `/platform/party/*`
- `/platform/calendar`
- `/platform/questionnaire`
- `/platform/quarterMaster`
- `/platform/teacherStatistics`
- `/platform/observation_results`
- `/platform/cvShow`
