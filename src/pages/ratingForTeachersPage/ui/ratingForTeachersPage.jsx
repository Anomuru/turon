import React from 'react';
import { useRatingForTeachers, CATEGORIES } from 'features/ratingForTeachers/index.js';
import { RatingTable } from 'entities/ratingForTeachers/index.js';
import cls from './ratingForTeachersPage.module.sass';

/**
 * Page layer: only composes layout — no business logic here.
 * Data / state → features/ratingForTeachers (useRatingForTeachers)
 * Pure UI      → entities/ratingForTeachers (RatingTable)
 */
export const RatingForTeachersPage = () => {
    const {
        category,
        setCategory,
        dateValue,
        showCurrentMonth,
        data,
        loading,
        handleDateChange,
        handleCurrentMonthToggle,
    } = useRatingForTeachers();

    const activeCategoryLabel =
        CATEGORIES.find((c) => c.value === category)?.label ?? '';

    return (
        <div className={cls.page}>

            {/* ── Page Header ─────────────────────────────────────────── */}
            <header className={cls.header}>
                <div className={cls.headerLeft}>
                    <h1 className={cls.title}>O'qituvchilar reytingi</h1>
                    <p className={cls.subtitle}>
                        Kategoriya bo'yicha o'qituvchilar ko'rsatkichlari
                    </p>
                </div>

                {category && (
                    <span className={cls.activePill}>
                        {activeCategoryLabel}
                    </span>
                )}
            </header>

            {/* ── Filter Panel ─────────────────────────────────────────── */}
            <section className={cls.filterPanel}>

                {/* Category pills */}
                <div className={cls.filterGroup}>
                    <label className={cls.filterLabel}>Kategoriya</label>
                    <div className={cls.pills}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                className={`${cls.pill} ${category === cat.value ? cls.pillActive : ''}`}
                                onClick={() => setCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date selector */}
                <div className={cls.filterGroup}>
                    <label className={cls.filterLabel}>Davr</label>
                    <div className={cls.dateRow}>
                        <label className={`${cls.toggleChip} ${showCurrentMonth ? cls.toggleChipActive : ''}`}>
                            <input
                                type="checkbox"
                                checked={showCurrentMonth}
                                onChange={(e) => handleCurrentMonthToggle(e.target.checked)}
                            />
                            Joriy oy
                        </label>

                        <div className={cls.monthPickerWrap}>
                            <span className={cls.calIcon}>📅</span>
                            <input
                                type="month"
                                value={dateValue}
                                onChange={handleDateChange}
                                className={cls.monthPicker}
                                title="Yil va oyni tanlang"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Data Table ───────────────────────────────────────────── */}
            <section className={cls.tableSection}>
                <RatingTable data={data} loading={loading} category={category} />
            </section>
        </div>
    );
};
