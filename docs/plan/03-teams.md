# 03 — Разделение на две команды

## Принцип

**Team FIN («Pul»)** — владеет всем, что связано с деньгами, от эндпоинта до пикселя. Не «делает задачи по финансам», а **владеет доменом**: если в системе что-то посчитало, провело или показало сумму — это ответственность FIN.

**Team CORE («Platforma»)** — образовательный домен (ученики, учителя, группы, расписание, уроки, наблюдения) плюс вся инфраструктура (`shared/`, `app/`, `widgets/`), на которой стоят обе команды.

Границу можно провести чисто: из 266 денежных файлов в `shared/` лежит **ровно один** (`shared/const/routers.js` — просто константы путей). Деньги в этом проекте не протекли в фундамент, и это большая удача.

---

## Матрица владения

### Team FIN

```
# Сущности
src/entities/accounting/**              (3 202 строк, 57 файлов)
src/entities/accountingPageNew/**       (462)
src/entities/capital/**                 (930)
src/entities/contract/**                (46)
src/entities/employerSalary/**          (125)
src/entities/giveSalary/**              (223)
src/entities/inkasatsiya/**             (309)
src/entities/loans/**                   (186)
src/entities/loanProfile/**             (282)
src/entities/teacherSalary/**           (359)

# Фичи
src/features/studentPayment/**          (834)
src/features/studentPaymentDates/**     (96)
src/features/salaryEdits/**             (183)
src/features/giveSalary/**              (79)
src/features/giveEmployerSalary/**      (106)
src/features/createCapitalModal/**      (214)
src/features/accountingNewFilter/**     (368)

# Страницы
src/pages/accountingPage/**             (4 529)
src/pages/accountingPage2.0/**          (65)
src/pages/capitalPage/**                (400)
src/pages/contractPage/**               (11)
src/pages/contributionsPage/**          (987)
src/pages/financeDashboardPage/**       (574)
src/pages/giveSalaryPage/**             (256)
src/pages/employerSalaryPage/**         (104)
src/pages/teacherSalaryPage/**          (75)
src/pages/inkasatsiyaPage/**            (178)

# Точечно (внутри чужих модулей — до переезда в слоты)
src/entities/adminTaskManager/ui/debtorCRMBoard/**            (1 097 — CRM должников)
src/entities/profile/studentProfile/ui/studentProfileAmountPath/**  (501 — платежи ученика)

# Новое, создаётся с нуля
src/entities/finance/**                 (публичный API + слоты + money kernel)
```

Итого ≈ **16 000 строк** и главный источник бизнес-риска в системе.

### Team CORE

Всё остальное. Основное:

```
# Образовательный домен
src/entities/students, teachers, groups, class, flows, flowList, flowsProfile,
   timeTable, timeTableTuron, teacherLessonPlans, lessonPlanDailyReport,
   educationQuality, ratingForTeachers, teacherAttendance, teacherPD,
   teacherStatistics, calendar, rooms, School, schoolHome, parents,
   lead, filteredLeadsList, vacancy, employer, targetItems, statistics,
   adminTaskManager (кроме debtorCRMBoard), profile (кроме платёжной вкладки)

src/features/**   (кроме перечисленных у FIN)
src/pages/**      (кроме перечисленных у FIN)

# Инфраструктура — CORE владеет, обе команды пользуются
src/app/**        (роутер, гарды, layouts, providers)
src/shared/**     (http-клиент, ui-кит, хуки, константы)
src/widgets/**    (header, menuBar)
```

---

## Правило разрешения спорных зон

Список файлов не покрывает всё — граница проходит внутри некоторых модулей. Правило:

> **Считает, проводит или записывает деньги → FIN.**
> **Показывает готовое число, полученное от API или из слота FIN → CORE**, но обязан использовать `formatMoney` и не имеет права на арифметику.

Разбор конкретных случаев:

| Модуль | Решение | Почему |
|--------|---------|--------|
| `pages/directorDashboardPage` | **CORE** — оболочка<br>**FIN** — вкладка «Moliyaviy statistika» | Страница с вкладками для 4 ролей; финансовая вкладка встраивается слотом `<FinanceStatsTab/>` |
| `entities/profile/studentProfile` | **CORE** — профиль<br>**FIN** — вкладка платежей | `studentProfileAmountPath` (501 строка) — расчёт платежей, это FIN. Переезжает в слот `<StudentPaymentPanel/>` |
| `adminTaskManager/debtorCRMBoard` | **FIN** | 1 097 строк про долги. Долг — деньги. Процессная часть (звонки/задачи) — по контракту с CORE |
| `entities/quarterMaster` + `pages/quarterMasterPage` | **⚠️ решить на кикоффе** | Заявки завхоза граничат с закупками и капиталом. Если модуль только оформляет заявку — CORE; если считает стоимость и списывает с кассы — FIN |
| `entities/contract` | **FIN** | Всего 46 строк, но договор = сумма и обязательства |
| `features/groupProfile` | **CORE**, с оговоркой | Показывает суммы через `toLocaleString` — после money kernel обязан перейти на `formatMoney` |
| `pages/partyPage` | **CORE** | 1 409 строк, но это партии/реклама, не деньги |

Спорное, не попавшее в таблицу, решается правилом выше. Если правило не даёт однозначного ответа — **по умолчанию FIN**: денежная ошибка дороже организационных издержек.

---

## CODEOWNERS

Создать `.github/CODEOWNERS` — это то, что превращает разделение из договорённости в механику ревью:

```gitignore
# По умолчанию — платформенная команда
*                                           @turon/core

# ── ДЕНЬГИ ───────────────────────────────────────────
/src/entities/finance/                      @turon/fin
/src/entities/accounting/                   @turon/fin
/src/entities/accountingPageNew/            @turon/fin
/src/entities/capital/                      @turon/fin
/src/entities/contract/                     @turon/fin
/src/entities/employerSalary/               @turon/fin
/src/entities/giveSalary/                   @turon/fin
/src/entities/inkasatsiya/                  @turon/fin
/src/entities/loans/                        @turon/fin
/src/entities/loanProfile/                  @turon/fin
/src/entities/teacherSalary/                @turon/fin
/src/features/studentPayment/               @turon/fin
/src/features/studentPaymentDates/          @turon/fin
/src/features/salaryEdits/                  @turon/fin
/src/features/giveSalary/                   @turon/fin
/src/features/giveEmployerSalary/           @turon/fin
/src/features/createCapitalModal/           @turon/fin
/src/features/accountingNewFilter/          @turon/fin
/src/pages/accountingPage/                  @turon/fin
/src/pages/accountingPage2.0/               @turon/fin
/src/pages/capitalPage/                     @turon/fin
/src/pages/contractPage/                    @turon/fin
/src/pages/contributionsPage/               @turon/fin
/src/pages/financeDashboardPage/            @turon/fin
/src/pages/giveSalaryPage/                  @turon/fin
/src/pages/employerSalaryPage/              @turon/fin
/src/pages/teacherSalaryPage/               @turon/fin
/src/pages/inkasatsiyaPage/                 @turon/fin
/src/entities/adminTaskManager/ui/debtorCRMBoard/  @turon/fin

# ── ОБЩЕЕ: CORE владеет, FIN обязателен в ревью ──────
/src/shared/                                @turon/core @turon/fin
/src/app/routers/                           @turon/core @turon/fin
/src/widgets/menuBar/                       @turon/core @turon/fin
/.github/                                   @turon/core @turon/fin
```

Последний блок — ключевой. `shared/` и роутер — фундамент под деньгами; CORE может их менять, но не втихую.

---

## Контракт между командами

**Направление зависимости — одностороннее.** CORE знает про публичный API FIN. FIN про CORE не знает ничего.

```
CORE ──зависит от──▶ entities/finance/index.js
FIN  ──зависит от──▶ shared/ (http, ui-кит, хуки)
```

Циклов нет. FIN может работать, даже когда CORE переделывает страницы, и наоборот.

**Что FIN обязуется публиковать** (`entities/finance/index.js`):

| Экспорт | Для чего | Кто встраивает |
|---------|----------|----------------|
| `<StudentPaymentPanel studentId/>` | Вкладка платежей | CORE, профиль ученика |
| `<FinanceStatsTab branchId/>` | Финансовая статистика | CORE, дашборд директора |
| `<DebtBadge studentId/>` | Индикатор долга в списках | CORE, списки учеников |
| `formatMoney(value)` | Единый формат сумм | CORE, везде где показываются деньги |
| `financeRoutes` | Роуты и пункты меню FIN | CORE, сборщик роутов |

**Правила изменения контракта:**

1. Ломающее изменение публичного API — PR в репозиторий с ревью **обеих** команд.
2. Расширять (добавлять экспорт) — свободно. Ломать — только по договорённости.
3. Слоты принимают **только идентификаторы** (`studentId`, `branchId`), не объекты с данными. Иначе CORE начнёт передавать денежные структуры, и граница потечёт.
4. Ошибки внутри слота обрабатывает FIN. Слот не имеет права уронить страницу CORE — обязателен error boundary внутри слота.

**Что запрещено обеим командам:**

- ❌ CORE импортирует что-либо из `entities/finance/**`, кроме `index.js` — блокируется линтером
- ❌ CORE делает арифметику с деньгами — блокируется линтером (`parseFloat` на денежных полях)
- ❌ FIN правит `shared/` без ревью CORE
- ❌ Любая команда добавляет роут в общий конфиг после Фазы 1 — только через свой `routes.jsx`

---

## Определение готовности (DoD)

Требования к деньгам **строже** — сознательно. Ошибка в расписании — неудобство, ошибка в зарплате — потеря денег и доверия.

| Критерий | Team FIN | Team CORE |
|----------|:--------:|:---------:|
| PR-ревью | **2 аппрува** | 1 аппрув |
| Тесты на новый код | **обязательно** | обязательно на бизнес-логику |
| Покрытие денежной арифметики | **100%** | — |
| Покрытие модуля | 80% | 80% |
| `parseFloat`/`toFixed` на деньгах | **запрещено линтером** | запрещено линтером |
| E2E на критичный сценарий | **обязательно** | на ключевые флоу |
| Файл > 400 строк | требует обоснования | требует обоснования |
| Изменение публичного API | ревью CORE | — |

«100% покрытие денежной арифметики» — это про money kernel и функции расчёта, не про UI. Требование выполнимое: это чистые функции, их тестировать просто и быстро.

---

## Состав и размер

По коммитам за последние 12 месяцев активны:

| Автор | Коммитов |
|-------|----------|
| `ikromovvv` | 135 |
| `anomuru` / `Anomuru` | 106 |
| `shaha` / `unarovshaha` | 75 |
| `home` | 8 |
| `Shahzod Omonboyev` | 4 |
| `DeadMonstr` | 3 |

**Рекомендация: FIN — 2 человека, CORE — 3.**

Почему FIN меньше, хотя домен критичнее: денежный домен — это ~16k строк из 83k, и работа там идёт медленно **по замыслу** (тесты, два ревью, никаких срезаний углов). Три человека в FIN будут ждать ревью друг друга. CORE больше, потому что тащит и образовательный домен, и всю инфраструктуру для обеих команд.

**Критерий отбора в FIN — не «кто сейчас свободен».** Нужны двое, кому дисциплина «каждая строка под тестом, никаких быстрых хотфиксов в прод» комфортна, а не в тягость. Один из них должен хорошо знать текущую бухгалтерию: `pages/accountingPage` — 4 529 строк недокументированной бизнес-логики, и человек, который в ней уже разбирался, экономит команде недели. По churn (`src/pages/accountingPage` — 31 коммит за 6 месяцев, `src/entities/capital` — 16) видно, что такие люди в команде есть — посмотрите `git log --format='%an' -- src/pages/accountingPage | sort | uniq -c`.

**Состав команд — ваше решение, не моё:** я вижу коммиты, но не вижу людей.

---

## Синхронизация

Минимум церемоний, но три вещи обязательны:

1. **Еженедельный контракт-синк, 30 минут.** Только один вопрос: меняется ли публичный API FIN и что от этого ломается у CORE. Не статус-митинг.
2. **Общий канал для `shared/`.** Любой PR в `shared/`, `app/routers`, `widgets/menuBar` — уведомление обеим командам (это обеспечивает CODEOWNERS).
3. **Фаза 1 делается вместе.** Пока не проведена граница, разъезжаться нельзя — иначе обе команды будут переписывать одни и те же файлы. Подробности — в [04-roadmap.md](./04-roadmap.md).

---

## Риски разделения

| Риск | Как митигируем |
|------|---------------|
| **FIN блокируется на CORE** (нужна доработка `shared/`) | FIN имеет право на PR в `shared/` с ревью CORE — не «попросить и ждать». CORE обязуется ревьюить `shared/` в течение 1 рабочего дня |
| **Граница потечёт**, CORE начнёт считать деньги | Линтер, а не договорённость. Правило без автоматической проверки не выживет |
| **Знание бухгалтерии у одного человека** | Парное ревью в FIN (2 аппрува) — не только качество, но и распространение знания |
| **CORE «сгружает» в FIN всё, где есть цифра** | Правило разрешения спорных зон + разбор на еженедельном синке |
| **Дублирование UI**: FIN делает свои таблицы вместо `shared/ui` | `shared/ui` доступен обеим; новые общие компоненты FIN контрибьютит в `shared/` через ревью CORE |
| **Конфликты в роутере/меню** (38 и 35 коммитов за 6 мес) | Модуляризация роутов и меню в Фазе 1 — до того, как команды разъедутся |

---

Дальше: [дорожная карта по фазам](./04-roadmap.md) · [бэклог FIN](./05-backlog-fin.md) · [бэклог CORE](./06-backlog-core.md)
