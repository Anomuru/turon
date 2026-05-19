# Teacher Lesson Plans by Date Range API

This document details the newly created backend API endpoint that retrieves a comprehensive, fully-detailed list of lesson plans for a given teacher within a specific date range.

## Endpoint Details

* **URL:** `/api/lesson_plan/teacher-plans/` (or the configured standard prefix for your project's `lesson_plan` app)
* **Method:** `GET`
* **Content-Type:** `application/json`

---

## Request Parameters

The endpoint expects the following query parameters:

| Parameter | Type | Required | Description | Format / Example |
| :--- | :--- | :--- | :--- | :--- |
| `teacher_id` | `integer` | **Yes** | The ID of the teacher. | `5` |
| `start_date` | `string` | **Yes** | The start date of the range (inclusive). | `YYYY-MM-DD` (e.g., `2026-05-01`) |
| `end_date` | `string` | **Yes** | The end date of the range (inclusive). | `YYYY-MM-DD` (e.g., `2026-05-15`) |

---

## Response Formats

### 1. Success Response (`200 OK`)
Returns a complete list of all lesson plans created by the teacher in the specified range.

```json
[
  {
    "id": 12,
    "teacher": {
      "id": 5,
      "name": "Anvar",
      "surname": "Sattorov",
      "phone": "+998901234567"
    },
    "group": {
      "id": 34,
      "name": "General English Pre-Int"
    },
    "flow": null,
    "class_time_table": {
      "id": 89,
      "name": "Class 3-A English",
      "week": "Monday",
      "hours": {
        "id": 1,
        "name": "1-para",
        "start_time": "09:00",
        "end_time": "10:30"
      },
      "room": {
        "id": 3,
        "name": "Room 101"
      },
      "subject": {
        "id": 12,
        "name": "English"
      }
    },
    "students": [
      {
        "comment": "Perfect performance in today's homework.",
        "student": {
          "id": 101,
          "name": "Shirin",
          "surname": "Kamilova"
        }
      },
      {
        "comment": "Missed the classroom reading activity.",
        "student": {
          "id": 102,
          "name": "Jasur",
          "surname": "Tursunov"
        }
      }
    ],
    "date": "2026-05-11",
    "objective": "Understanding present continuous tense and using it in speaking.",
    "main_lesson": "Explanation of present continuous formula, classroom discussion and exercises.",
    "homework": "Workbook Page 45, Exercises 1 to 5.",
    "assessment": "Informal peer check during the speaking phase.",
    "activities": "10 min warm-up, 20 min grammar explanation, 30 min speaking practice.",
    "resources": "Whiteboard, student workbook, audio track 3.",
    "updated": "2026-05-11",
    "ball": 95,
    "conclusion": "Excellent active participation from all students."
  }
]
```

### 2. Validation Errors (`400 Bad Request`)

* **Missing `teacher_id`:**
  ```json
  {
    "error": "teacher_id is required"
  }
  ```

* **Missing date parameters:**
  ```json
  {
    "error": "Both start_date and end_date are required"
  }
  ```

* **Invalid date format:**
  ```json
  {
    "error": "Invalid date format. Use YYYY-MM-DD"
  }
  ```

* **Invalid chronological order (`start_date > end_date`):**
  ```json
  {
    "error": "start_date must be before or equal to end_date"
  }
  ```
