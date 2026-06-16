import React, { useEffect, useState } from 'react';
import { Select } from 'shared/ui/select/index.js';
import { GroupQuarterTable } from 'features/groupProfile/index.js';
import cls from './SubjectDetail.module.sass';
import { useHttp } from 'shared/api/base.js';
import { API_URL } from 'shared/api/base.js';

/**
 * SubjectDetail shows exam results for a selected subject and quarter.
 * Props:
 * - subjectId: id of the subject to display
 * - onBack: callback to return to dashboard
 */
export const SubjectDetail = ({ subjectName, data, onBack }) => {
  if (!subjectName || !data?.length) return null;

  // 1. Barcha unique assignment nomlarini yig'amiz (farqlarni yumshatib)
  const assignmentNames = new Set();

  data.forEach(student => {
    const sub = student.subjects?.find(s =>
        s?.subject_name?.trim() === subjectName?.trim()
    );

    if (sub?.assignments) {
      sub.assignments.forEach(a => {
        if (a?.test_name) {
          // Farqlarni tozalab qo'shamiz (masalan: Summative-1 va Summative 1 bir xil bo'lsin)
          const cleanedName = a.test_name.trim()
              .replace(/-/g, ' ')           // tire ni bo'sh joyga aylantirish
              .replace(/\s+/g, ' ');        // bir nechta bo'sh joyni bitta qilish

          assignmentNames.add(cleanedName);
        }
      });
    }
  });

  const headers = Array.from(assignmentNames).sort(); // tartib bilan chiqsin

  console.log("Chiqqan Headers:", headers); // debug uchun

  // 2. Rows tayyorlash
  const rows = data.map(student => {
    const sub = student.subjects?.find(s =>
        s?.subject_name?.trim() === subjectName?.trim()
    );
    if (!sub) return null;

    const scores = headers.map(h => {
      // Har bir header uchun mos assignmentni topish (tozalangan holda)
      const ass = sub.assignments?.find(a => {
        if (!a?.test_name) return false;
        const cleaned = a.test_name.trim()
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ');
        return cleaned === h;
      });

      return ass ? ass.percentage : null;
    });

    return {
      name: `${student.first_name} ${student.last_name}`,
      scores,
      average: sub.average_result || 0
    };
  }).filter(Boolean);

  return (
      <div className={cls.detail}>
        <div className={cls.header}>
          <button className={cls.backBtn} onClick={onBack}>
            <span className={cls.icon}>←</span> Ortga
          </button>
          <h2 className={cls.title}>{subjectName} bo'yicha batafsil</h2>
        </div>

        <div className={cls.tableWrapper}>
          <table className={cls.customTable}>
            <thead>
            <tr>
              <th>O'quvchi</th>
              {headers.map(h => <th key={h}>{h}</th>)}
              <th>O'rtacha</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((row, i) => (
                <tr key={i}>
                  <td className={cls.studentName}>{row.name}</td>
                  {row.scores.map((s, j) => (
                      <td key={j} className={s !== null ? cls.score : cls.emptyScore}>
                        {s !== null ? `${s}%` : '—'}
                      </td>
                  ))}
                  <td className={cls.finalAvg}>{row.average.toFixed(2)}%</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};
