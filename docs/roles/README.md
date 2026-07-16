# Документация по ролям — Turon

## Список ролей

| Роль (ROLES.*) | job в localStorage | Файл документации |
|---------------|-------------------|-------------------|
| admin | `"admin"` | [admin.md](./admin.md) |
| director | `"direktor"` | [director.md](./director.md) |
| main_director | `"director"` | [main_director.md](./main_director.md) |
| programmer | `"programmer"` | [programmer.md](./programmer.md) |
| accountant | `"accountant"` | [accountant.md](./accountant.md) |
| teacher | `"teacher"` | [teacher.md](./teacher.md) |
| spiritualist | `"spiritualist"` | [spiritualist.md](./spiritualist.md) |
| advertising | `"advertising"` | [advertising.md](./advertising.md) |
| zavuch | `"Zavuch"` | [zavuch.md](./zavuch.md) |
| zavxos | `"Zavxos"` | [zavxos.md](./zavxos.md) |
| smm | `"smm"` | [smm.md](./smm.md) |
| methodist | `"methodist"` | [methodist.md](./methodist.md) |
| muxarir | `"muxarir"` | [muxarir.md](./muxarir.md) |
| operator | `"operator"` | [operator.md](./operator.md) |

> **Важно:** `ROLES.director` = `"direktor"`, `ROLES.main_director` = `"director"` — эти строки перепутаны в ROLES-константе, но именно так хранятся в localStorage.

---

## Матрица доступа к страницам меню

| Страница | admin | director | main_director | programmer | accountant | teacher | spiritualist | advertising | zavuch | zavxos | smm | methodist | muxarir | operator |
|---------|:-----:|:--------:|:-------------:|:----------:|:----------:|:-------:|:------------:|:-----------:|:------:|:------:|:---:|:---------:|:-------:|:--------:|
| Dashboard | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Registratsiya | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Statistika | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ta'lim sifati | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Teacher items | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| School items | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Home Page Items | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Operator Tasks | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Partiyalar | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Observation | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dars Rejasi | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Todoist | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kalendar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| O'quvchilar | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| O'qituvchilar | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sinflar | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Time Table | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Capital | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Buxgalteriya | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| So'rovnoma | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zavxoz profile | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| TeacherStatistics | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Teacher observe | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Xo'jalik zayavka | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Общие страницы (разделяются несколькими ролями)

### O'quvchilar + Student Profile
Общая для: **admin, programmer, zavuch, spiritualist, advertising**
Подробности о различиях — в каждом файле роли.

### O'qituvchilar + Teacher Profile
Общая для: **admin, programmer, spiritualist**
Подробности — в каждом файле роли.

### Sinflar + Group Profile
Общая для: **admin, programmer, teacher, zavuch, spiritualist**

### Time Table
Общая для: **admin, programmer, zavuch, spiritualist**
Admin имеет серьёзные ограничения — см. [admin.md](./admin.md).

### Capital
Общая для: **admin, director, main_director, programmer, accountant**

### Buxgalteriya
Общая для: **admin, director, main_director, programmer**

### Dashboard
Общая для: **director, main_director, spiritualist, accountant**
Каждая роль видит разные вкладки внутри — подробности в файлах ролей.

### Todoist
Общая для: **admin, director, main_director, programmer, accountant, teacher, methodist, muxarir, operator, smm, zavxos**
(spiritualist, advertising, zavuch НЕ имеют доступа к Todoist)

---

## Источники (файлы конфигурации)

| Что | Файл |
|-----|------|
| Роли | `src/shared/const/roles.js` |
| Меню | `src/widgets/menuBar/model/consts/menuConfig.js` |
| Роутинг (основной) | `src/app/routers/config/routersConfigList.jsx` |
| Роутинг (профили/детали) | `src/app/routers/config/routerConfigProfiles.jsx` |
| AppRouter | `src/app/routers/ui/AppRouter.jsx` |
| Хедер | `src/widgets/header/ui/header.jsx` |
