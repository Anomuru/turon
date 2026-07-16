# Роль: Director

**job (localStorage):** `"direktor"`
**ROLES.director** = `"direktor"`

> Внимание на путаницу в константах: `ROLES.director` хранит строку `"direktor"`, а `ROLES.main_director` хранит `"director"`. В коде проверки идут по строковым значениям.

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Dashboard | `/platform/dashboard` |
| 2 | Registratsiya | `/platform/register` |
| 3 | Statistika | `/platform/Statistics/` |
| 4 | **Ta'lim sifati** *(только director)* | `/platform/educationQuality` |
| 5 | Teacher items | `/platform/teacherMenu` |
| 6 | School items | `/platform/schoolMenu` |
| 7 | Home Page Items | `/platform/cvShow` |
| 8 | Partiyalar | `/platform/party/*` |
| 9 | Todoist | `/platform/todoist/*` |
| 10 | Capital | `/platform/capital/:id` |
| 11 | Buxgalteriya | `/platform/accounting/*` |
| 12 | So'rovnoma | `/platform/questionnaire` |
| 13 | Zavxoz profile | `/platform/quarterMaster` |
| 14 | Xo'jalik uchun zayavka | `/platform/applicationSystem` |

**Источник:** `src/widgets/menuBar/model/consts/menuConfig.js`

---

## Хедер

**Файл:** `src/widgets/header/ui/header.jsx`

| Элемент | Доступ |
|---------|--------|
| Поиск | ✅ |
| Кнопка настроек | ✅ |
| Кнопка назад | ✅ |
| Переключатель филиала (Location) | ❌ |

**Строка:** `header.jsx:123` — `userRole === "director" ? <Location/> : null`

Эта проверка использует строку `"director"`, которая соответствует `ROLES.main_director`. Поэтому `ROLES.director` (строка `"direktor"`) **не имеет** переключателя филиала в хедере.

> **Несоответствие в коде:** В `studentsFilter.jsx` данные фильтруются по `currentBranch` когда `ROLE === "direktor"` (строка `studentsFilter.jsx:49`), но UI-переключателя для смены филиала нет. Director видит данные текущего филиала, но не может его менять через интерфейс.

---

## Страницы

---

### 1. Dashboard

**Путь:** `/platform/dashboard`
**Файл:** `src/pages/directorDashboardPage/ui/directorDashboardPage.jsx`
**Общая с ролями:** main_director, spiritualist, accountant

#### Вкладки Dashboard

**Строки:** `directorDashboardPage.jsx:252-256`

| Вкладка | Director | Main_director | Spiritualist | Accountant |
|---------|:--------:|:-------------:|:------------:|:----------:|
| Dashboard | ✅ | ✅ | ❌ | ❌ |
| Moliyaviy statistika | ✅ | ✅ | ❌ | ✅ |
| Kunlik Dars Rejasi Hisoboti | ✅ | ✅ | ✅ | ❌ |

```js
{job === "spiritualist" || job === "accountant" ? "" : <Button>Dashboard</Button>}
{job === "spiritualist" ? "" : <Button>Moliyaviy statistika</Button>}
{job === "accountant" ? "" : <Button>Kunlik Dars Rejasi Hisoboti</Button>}
```

**Director видит все 3 вкладки.**

---

### 2. Registratsiya

**Путь:** `/platform/register`
**Общая с ролями:** admin, main_director, programmer

Нет role-специфических ограничений.

---

### 3. Statistika

**Путь:** `/platform/Statistics/`
**Файл:** `src/pages/statisticsPage/ui/statisticsPage.jsx`
**Общая с ролями:** main_director, programmer

В `statisticsPage.jsx:37` branch-фильтр:
```js
ROLE === "director" ? currentBranch : branchId
```
Это `ROLES.main_director`. Director (direktor) использует собственный `branchId`.

---

### 4. Ta'lim sifati (Только Director)

**Путь:** `/platform/educationQuality`
**Файл:** `src/pages/educationQualityPage/`
**Только для director** — единственная роль с доступом.

Из этой страницы можно перейти на детальную страницу:
- `/platform/educationQuality/details` (`EducationQualityDetails`)

---

### 5. Teacher items

**Путь:** `/platform/teacherMenu`
**Файл:** `src/pages/shortMenuData/teacher/shortTeacherData.jsx`
**Общая с ролями:** main_director

---

### 6. School items

**Путь:** `/platform/schoolMenu`
**Файл:** `src/pages/shortMenuData/schoolItem/schoolItem.jsx`
**Общая с ролями:** main_director

---

### 7. Home Page Items

**Путь:** `/platform/cvShow`
**Файл:** `src/pages/cvSubmissions/`
**Общая с ролями:** main_director, smm

---

### 8. Partiyalar

**Путь:** `/platform/party/*`
**Файл:** `src/pages/partyPage/partyPage.jsx`
**Общая с ролями:** main_director, advertising

---

### 9. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, main_director, programmer, accountant, teacher, methodist, muxarir, operator, smm, zavxos

Нет role-специфических ограничений.

---

### 10. Capital

**Путь:** `/platform/capital/:id`
**Общая с ролями:** admin, main_director, programmer, accountant

#### Навигация из Capital

| Куда | Как |
|------|-----|
| `/capital/capitalBoxProfile/:id` (CapitalInside) | Клик на кассу |
| `/capital/capitalBoxProfile/:id/profile/:id` | Из CapitalInside |

Нет role-специфических ограничений.

---

### 11. Buxgalteriya

**Путь:** `/platform/accounting/*`
**Файл:** `src/pages/accountingPage2.0/`
**Общая с ролями:** admin, main_director, programmer

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

### 12. So'rovnoma

**Путь:** `/platform/questionnaire`
**Файл:** `src/pages/questionnaire/ui/questionnaire.jsx`
**Общая с ролями:** main_director, advertising

---

### 13. Zavxoz profile

**Путь:** `/platform/quarterMaster`
**Файл:** `src/pages/quarterMasterPage/`
**Общая с ролями:** main_director, programmer, zavxos

---

### 14. Xo'jalik uchun zayavka

**Путь:** `/platform/applicationSystem`
**Общая с ролями:** admin, main_director, spiritualist, advertising

---

### 15. Teacher Profile (через O'qituvchilar — нет в меню)

Director **не имеет** пункта O'qituvchilar в меню, но через Buxgalteriya (клик на учителя в таблице платежей) можно попасть в Teacher Profile.

**Если director попадает в Teacher Profile:**

**Файл:** `src/entities/profile/teacherProfile/ui/teacherProfileInfo/teacherProfileInfo.jsx:107`
```js
(role === "direktor" || role === "director") && <Button onClick={() => navigate(`teacherSalaryPage/${teacherId?.id}`)}>Balans</Button>
```

Кнопка "Balans" **показывается** для director (строка `"direktor"`).

#### Навигация из Teacher Profile (если попал)

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `teacherSalaryPage/:id` | Кнопка "Balans" ✅ | `teacherProfileInfo.jsx:107` |
| `../teacherAttendance/:id` | Карточка Attendance | `teacherProfileInfo.jsx:164` |

#### Teacher Salary Page → Give Salary Page

Из `teacherSalaryPage/:id` → клик на источник зарплаты → `giveTeacherSalaryPage/:id`

---

## Страницы, недоступные через меню

- `/platform/students/*` — нет в меню для director
- `/platform/teacher/*` — нет в меню для director
- `/platform/groups/*` — нет в меню для director
- `/platform/time/*` — нет в меню для director
