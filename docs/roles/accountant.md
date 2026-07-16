# Роль: Accountant

**job (localStorage):** `"accountant"`
**ROLES.accountant** = `"accountant"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Dashboard | `/platform/dashboard` |
| 2 | Todoist | `/platform/todoist/*` |
| 3 | Capital | `/platform/capital/:id` |

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

### 1. Dashboard

**Путь:** `/platform/dashboard`
**Файл:** `src/pages/directorDashboardPage/ui/directorDashboardPage.jsx`
**Общая с ролями:** director, main_director, spiritualist

#### Вкладки Dashboard для accountant

**Строки:** `directorDashboardPage.jsx:252-256`

| Вкладка | Accountant |
|---------|:----------:|
| Dashboard | ❌ — строка `:252` |
| **Moliyaviy statistika** | ✅ |
| Kunlik Dars Rejasi Hisoboti | ❌ — строка `:255` |

```js
{job === "spiritualist" || job === "accountant" ? "" : <Button>Dashboard</Button>}
{job === "accountant" ? "" : <Button>Kunlik Dars Rejasi Hisoboti</Button>}
```

Accountant видит **только** вкладку "Moliyaviy statistika". Начальное состояние:
```js
useState(job === "accountant" ? "Moliyaviy statistika" : ...)
```

---

### 2. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, main_director, programmer, teacher, methodist, muxarir, operator, smm, zavxos

---

### 3. Capital

**Путь:** `/platform/capital/:id`
**Общая с ролями:** admin, director, main_director, programmer

#### Навигация из Capital

| Куда | Как |
|------|-----|
| `/capital/capitalBoxProfile/:id` (CapitalInside) | Клик на кассу |
| `/capital/capitalBoxProfile/:id/profile/:id` | Из CapitalInside |

Нет role-специфических ограничений внутри Capital для accountant.
