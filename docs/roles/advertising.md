# Роль: Advertising

**job (localStorage):** `"advertising"`
**ROLES.advertising** = `"advertising"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Partiyalar | `/platform/party/*` |
| 2 | Kalendar | `/platform/calendar` |
| 3 | O'quvchilar | `/platform/students/*` |
| 4 | So'rovnoma | `/platform/questionnaire` |
| 5 | Xo'jalik uchun zayavka | `/platform/applicationSystem` |

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

### 1. Partiyalar

**Путь:** `/platform/party/*`
**Файл:** `src/pages/partyPage/partyPage.jsx`
**Общая с ролями:** director, main_director

---

### 2. Kalendar

**Путь:** `/platform/calendar`
**Файл:** `src/pages/calendarPage/`
**Общая с ролями:** spiritualist

---

### 3. O'quvchilar (Студенты)

**Путь:** `/platform/students/*`
**Файл:** `src/pages/studentsPage/ui/studentsAdminPage/studentsPage.jsx`
**Общая с ролями:** admin, programmer, zavuch, spiritualist

#### Вкладки — жёсткое ограничение для advertising

Advertising видит **только 1 вкладку**:
- Studying Students

**Строки:** `studentsPage.jsx:109` и `:326`
```js
job === "advertising" ? studentsFilter3 : ...
// studentsFilter3 = [{name: "studying_students"}]
```

New Students и Deleted Students скрыты.

#### Навигация из O'quvchilar

| Куда | Как | Файл:Строка |
|------|-----|-------------|
| `/students/RGBData` | Кнопка "RB-Baza" | `studentsHeader.jsx:53` |
| `/students/attendance` | Кнопка "Davomat" | `studentsHeader.jsx:59` |
| Student Profile | Клик на студента | через список |

---

### 3а. Student Profile — ограничения для advertising

#### Секция оплаты/баланса

**Файл:** `src/entities/profile/studentProfile/ui/studentProfileInfo/studentProfileInfo.jsx:211`

```js
role === "advertising" ? null : ...  // полностью скрыто
```

Для advertising: секция оплаты и баланса **полностью отсутствует** в профиле студента. Сумма не показывается, кнопок нет.

#### Контракт (Shartnoma)

Для advertising нет специфических ограничений в контракте — кнопки "Tasdiqlash" и "Yuklash" **доступны** (ограничены только для `spiritualist`).

---

### 4. So'rovnoma

**Путь:** `/platform/questionnaire`
**Файл:** `src/pages/questionnaire/ui/questionnaire.jsx`
**Общая с ролями:** director, main_director

---

### 5. Xo'jalik uchun zayavka

**Путь:** `/platform/applicationSystem`
**Файл:** `src/pages/applicationSystem/applicationSystem.jsx`
**Общая с ролями:** admin, director, main_director, spiritualist
