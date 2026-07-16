# Роль: Teacher

**job (localStorage):** `"teacher"`
**ROLES.teacher** = `"teacher"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Observation | `/platform/teacherObservation` |
| 2 | Dars Rejasi | `/platform/lessonPlan` |
| 3 | Todoist | `/platform/todoist/*` |
| 4 | Sinflar | `/platform/groups/*` |

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

### 1. Observation (Teacher Observation)

**Путь:** `/platform/teacherObservation`
**Файл:** `src/pages/teacherObservationPage/`
**Только для teacher**

Из Observation можно перейти:
- На детальную страницу наблюдения: `/platform/observationDetail/:observationId` (через `ObservationDetailPage`)

---

### 2. Dars Rejasi (Lesson Plan)

**Путь:** `/platform/lessonPlan`
**Файл:** `src/pages/lessonPlanPage/`
**Только для teacher**

---

### 3. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, main_director, programmer, accountant, methodist, muxarir, operator, smm, zavxos

---

### 4. Sinflar (Классы)

**Путь:** `/platform/groups/*`
**Файл:** `src/pages/groupsPage/ui/groupsPage/groupsPage.jsx`
**Общая с ролями:** admin, programmer, zavuch, spiritualist

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

Нет role-специфических ограничений внутри Sinflar/Group Profile для teacher.

---

### 4а. Student Profile (через Sinflar → Group Profile)

Teacher может попасть в Student Profile через клик на студента в четверти группы (`groupQuarterTable.jsx:24`).

**Секция оплаты:** для teacher нет ограничений — полная секция оплаты видна.
**Контракт:** кнопки "Tasdiqlash" и "Yuklash" доступны.
