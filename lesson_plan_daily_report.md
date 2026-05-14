# Lesson Plan Daily Report API Documentation

Ushbu API ma'lum bir filial va sana bo'yicha o'qituvchilarning kunlik darslari va ularning lesson plan (dars ishlanmasi) holatini olish uchun xizmat qiladi.

## Endpoint

**URL**: `/lesson_plan/daily-report/`  
**Method**: `GET`

## Query Parametrlari

| Parametr | Turi | Tavsif | Majburiy |
| :--- | :--- | :--- | :--- |
| `branch_id` | `int` | Filialning ID raqami | Ha |
| `date` | `string` | Hisobot sanasi (`YYYY-MM-DD` formatida). Default: Bugun | Yo'q |

## Muvaffaqiyatli Javob (200 OK)

API o'qituvchilar ro'yxatini qaytaradi. Har bir o'qituvchi ichida uning o'sha kungi darslari ro'yxati (`lessons`) mavjud.

### Javob strukturasi:

```json
[
  {
    "id": 45,
    "full_name": "O'qituvchi Ismi",
    "phone": "+998901234567",
    "lessons": [
      {
        "timetable_id": 123,
        "group": {
          "id": 10,
          "name": "Python 101"
        },
        "subject": {
          "id": 5,
          "name": "Backend"
        },
        "hours": {
          "start": "14:00",
          "end": "15:30"
        },
        "has_lesson_plan": true,
        "ai_score": 9,
        "ai_conclusion": "Dars maqsadi aniq, resurslar yetarli.",
        "status": "evaluated",
        "date": "2026-05-13"
      }
    ]
  }
]
```

### Maydonlar tavsifi:

- **`has_lesson_plan`**: `boolean` - O'qituvchi dars ishlanmasini to'ldirganmi yoki yo'qmi.
- **`ai_score`**: `int | null` - AI tomonidan berilgan ball (1-10).
- **`ai_conclusion`**: `string | null` - AI xulosasi.
- **`status`**: `string` - Lesson plan holati:
    - `no_plan`: Dars ishlanmasi to'ldirilmagan.
    - `pending`: To'ldirilgan, lekin AI hali tekshirmagan.
    - `evaluated`: AI tomonidan tekshirilgan va ball berilgan.

## Xatoliklar

- **400 Bad Request**: `branch_id` yuborilmaganda yoki `date` formati noto'g'ri bo'lganda.
- **404 Not Found**: Haftaning kuni tizimdan topilmaganda.
