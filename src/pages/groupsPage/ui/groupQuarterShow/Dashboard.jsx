import React from 'react';
import { SubjectCard } from './SubjectCard.jsx';
import cls from './Dashboard.module.sass';

/**
 * Dashboard displays a grid of SubjectCard components.
 * Props:
 * - subjects: array of subject objects {id, name, yearly_average}
 * - onSelect: function(subject) called when a card is clicked
 */
export const Dashboard = ({ subjects, onSelect, onShowStats }) => {
  return (
    <div className={cls.dashboardContainer}>
      <div className={cls.header}>
        <h2 className={cls.title}>Fanlar bo'yicha ko'rsatkichlar</h2>
        <button className={cls.statsBtn} onClick={onShowStats}>
          <span className={cls.icon}>📊</span>
          Statistikalar
        </button>
      </div>

      <div className={cls.dashboard}>
        {subjects && subjects.length > 0 ? (
          subjects.map((sub) => (
            <SubjectCard key={sub.id} subject={sub} onClick={onSelect} />
          ))
        ) : (
          <p className={cls.empty}>Fanlar topilmadi.</p>
        )}
      </div>
    </div>
  );
};
