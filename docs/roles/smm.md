# Роль: SMM

**job (localStorage):** `"smm"`
**ROLES.smm** = `"smm"`

---

## Меню (Sidebar)

| # | Название | Путь |
|---|---------|------|
| 1 | Home Page Items (CV Show) | `/platform/cvShow` |
| 2 | Todoist | `/platform/todoist/*` |

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

### 1. Home Page Items (CV Show)

**Путь:** `/platform/cvShow`
**Файл:** `src/pages/cvShowPage/` или аналог
**Общая с ролями:** director, main_director

Эта страница предназначена для управления контентом главной страницы / резюме.
Нет role-специфических ограничений внутри cvShow для smm.

---

### 2. Todoist

**Путь:** `/platform/todoist/*`
**Общая с ролями:** admin, director, main_director, programmer, accountant, teacher, methodist, muxarir, operator, zavxos

Нет role-специфических ограничений внутри Todoist для smm.
