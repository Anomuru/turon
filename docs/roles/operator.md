# Роль: Operator

**job (localStorage):** `"operator"`
**ROLES.operator** = `"operator"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Todoist | `/platform/todoist/*` |

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

### 1. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, main_director, programmer, accountant, teacher, methodist, muxarir, smm, zavxos

Нет role-специфических ограничений внутри Todoist для operator.

---

## Примечание

Operator — минимальная роль. Единственная страница — Todoist. Нет доступа к студентам, учителям, группам, финансам или статистике.
