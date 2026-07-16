# Роль: Main Director

**job (localStorage):** `"director"`
**ROLES.main_director** = `"director"`

> Внимание: строковое значение `"director"` принадлежит `ROLES.main_director`, а не `ROLES.director`. `ROLES.director` хранит `"direktor"`. Эта путаница есть в коде повсеместно.

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Dashboard | `/platform/dashboard` |
| 2 | Registratsiya | `/platform/register` |
| 3 | Statistika | `/platform/Statistics/` |
| 4 | Teacher items | `/platform/teacherMenu` |
| 5 | School items | `/platform/schoolMenu` |
| 6 | Home Page Items | `/platform/cvShow` |
| 7 | Partiyalar | `/platform/party/*` |
| 8 | Todoist | `/platform/todoist/*` |
| 9 | Capital | `/platform/capital/:id` |
| 10 | Buxgalteriya | `/platform/accounting/*` |
| 11 | So'rovnoma | `/platform/questionnaire` |
| 12 | Zavxoz profile | `/platform/quarterMaster` |
| 13 | Xo'jalik uchun zayavka | `/platform/applicationSystem` |

Отличие от `director`: **нет Ta'lim sifati** (только для `ROLES.director`).

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

**Файл:** `src/widgets/header/ui/header.jsx`

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек | ✅ |
| Кнопка назад | ✅ |
| **Переключатель филиала (Location)** | ✅ — только main_director |

**Строка:** `header.jsx:123`
```js
userRole === "director" ? <Location/> : null
```

main_director **единственная роль** с переключателем филиала в хедере. Выбранный филиал сохраняется в localStorage (`locationsSlice.js:30` — `userRole === "director"`).

---

## Страницы

---

### 1. Dashboard

**Путь:** `/platform/dashboard`
**Файл:** `src/pages/directorDashboardPage/ui/directorDashboardPage.jsx`
**Общая с ролями:** director, spiritualist, accountant

#### Вкладки Dashboard для main_director

**Строки:** `directorDashboardPage.jsx:252-256`

| Вкладка | main_director |
|---------|:-------------:|
| Dashboard | ✅ |
| Moliyaviy statistika | ✅ |
| Kunlik Dars Rejasi Hisoboti | ✅ |

main_director видит **все 3 вкладки** (как и director).

---

### 2. Registratsiya

**Путь:** `/platform/register`
**Общая с ролями:** admin, director, programmer

---

### 3. Statistika

**Путь:** `/platform/Statistics/`
**Файл:** `src/pages/statisticsPage/ui/statisticsPage.jsx`
**Общая с ролями:** director, programmer

Branch-фильтр (`statisticsPage.jsx:37`):
```js
ROLE === "director" ? currentBranch : branchId
```
main_director использует `currentBranch` — тот, который выбран через Location-переключатель.

---

### 4. Teacher items

**Путь:** `/platform/teacherMenu`
**Файл:** `src/pages/shortMenuData/teacher/shortTeacherData.jsx`
**Общая с ролями:** director

---

### 5. School items

**Путь:** `/platform/schoolMenu`
**Файл:** `src/pages/shortMenuData/schoolItem/schoolItem.jsx`
**Общая с ролями:** director

---

### 6. Home Page Items

**Путь:** `/platform/cvShow`
**Общая с ролями:** director, smm

---

### 7. Partiyalar

**Путь:** `/platform/party/*`
**Общая с ролями:** director, advertising

---

### 8. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, programmer, accountant, teacher, methodist, muxarir, operator, smm, zavxos

---

### 9. Capital

**Путь:** `/platform/capital/:id`
**Общая с ролями:** admin, director, programmer, accountant

#### Навигация из Capital

| Куда | Как |
|------|-----|
| `/capital/capitalBoxProfile/:id` | Клик на кассу |
| `/capital/capitalBoxProfile/:id/profile/:id` | Из CapitalInside |

---

### 10. Buxgalteriya

**Путь:** `/platform/accounting/*`
**Общая с ролями:** admin, director, programmer

#### Навигация из Buxgalteriya

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| Профиль студента/учителя | Клик на имя в таблице | `accountingPageNewTable.jsx:173` |
| Overhead log | Иконка чека | `accountingPageNewTable.jsx:195` |
| `/inkasatsiya/:id` | Через меню | роутинг |
| `/accounting/otchot/*` | Через меню | роутинг |
| `/accounting/overheadTypes` | Через меню | роутинг |
| `/accounting/loanProfile/:id` | Через меню | роутинг |

---

### 11. So'rovnoma

**Путь:** `/platform/questionnaire`
**Общая с ролями:** director, advertising

---

### 12. Zavxoz profile

**Путь:** `/platform/quarterMaster`
**Общая с ролями:** director, programmer, zavxos

---

### 13. Xo'jalik uchun zayavka

**Путь:** `/platform/applicationSystem`
**Общая с ролями:** admin, director, spiritualist, advertising

---

### 14. Teacher Profile (через Buxgalteriya)

main_director не имеет O'qituvchilar в меню, но через Buxgalteriya (клик на учителя) может попасть в Teacher Profile.

**Файл:** `src/entities/profile/teacherProfile/ui/teacherProfileInfo/teacherProfileInfo.jsx:107`
```js
(role === "direktor" || role === "director") && <Button onClick={() => navigate(`teacherSalaryPage/${teacherId?.id}`)}>Balans</Button>
```

Кнопка "Balans" **показывается** для main_director (строка `"director"`).

#### Навигация из Teacher Profile

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `teacherSalaryPage/:id` | Кнопка "Balans" ✅ | `teacherProfileInfo.jsx:107` |
| `../teacherAttendance/:id` | Карточка Attendance | `teacherProfileInfo.jsx:164` |

#### TeacherSalaryPage → GiveTeacherSalaryPage

Из `teacherSalaryPage/:id` → клик на источник → `giveTeacherSalaryPage/:id`

---

## Особенности main_director относительно других ролей

| Особенность | Описание |
|-------------|---------|
| Переключатель филиала | Единственная роль с Location в хедере |
| Сохранение филиала | Выбранный филиал сохраняется в localStorage (`selectedLocation_director`) |
| Branch в данных | Большинство страниц используют `currentBranch` для main_director |
| Ta'lim sifati | Недоступна (только для `ROLES.director`) |
| Teacher Salary | Доступна через профиль учителя |
