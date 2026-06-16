import React from 'react';
import cls from './SubjectCard.module.sass';

/**
 * SubjectCard displays a subject with its yearly average and a background color
 * based on mastery level.
 *
 * Props:
 * - subject: { id, name, yearly_average }
 * - onClick: function to call when the card is clicked
 */
export const SubjectCard = ({ subject, onClick }) => {
  const { name, median } = subject;

  // Determine mastery color
  const getColorClass = (val) => {
    if (val >= 80) return cls.green;
    if (val >= 60) return cls.yellow;
    return cls.red;
  };

  return (
    <div className={`${cls.card} ${getColorClass(median)}`} onClick={() => onClick(subject)}>
      <h3 className={cls.title}>{name}</h3>
      <div className={cls.infoBlock}>
        <span className={cls.label}>Sinf o'rtacha balli (Median)</span>
        <p className={cls.average}>{median?.toFixed(2) ?? '—'}</p>
      </div>
    </div>
  );
};
