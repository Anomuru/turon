import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_URL, headers, useHttp } from 'shared/api/base.js';
import { getCurrentBranch } from 'entities/oftenUsed/model/oftenUsedSelector.js';

export const CATEGORIES = [
    { value: 'observation', label: 'Kuzatuv (Observation)' },
    { value: 'lesson_plan', label: "Dars rejasi (Lesson Plan)" },
    { value: 'student_results', label: "O'quvchi natijalari" },
    { value: 'satisfaction', label: 'Qoniqish darajasi' },
    { value: 'contribution', label: 'Hissa (Contribution)' },
    { value: 'professionalism', label: 'Professionallik' },
    { value: 'pd', label: "Ma'ruzalar" },
    {value: "conduct", label: "Xulq-atvor (Conduct)"},
    {value: "responsiveness", label: "Fikr-mulohazalar (Feedback)"},
    {value: "collaboration", label: "Jamoaviy ish (Teamwork)"},
];

export const useRatingForTeachers = () => {
    const { request } = useHttp();
    const currentBranch = useSelector(getCurrentBranch);

    const ROLE = localStorage.getItem('job');
    const userBranchId = localStorage.getItem('branchId');
    const branchForFilter = ROLE === 'director' ? currentBranch : userBranchId;

    const [category, setCategory] = useState(CATEGORIES[0].value);
    const [dateValue, setDateValue] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [showCurrentMonth, setShowCurrentMonth] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(data, 'data')

    useEffect(() => {
        if (!branchForFilter || !category) return;

        let url = `${API_URL}Teachers/teacher-rating/?branch=${branchForFilter}&category=${category}`;
        if (year && month) {
            url += `&year=${year}&month=${month}`;
        }

        setLoading(true);
        request(url, 'GET', null, headers())
            .then((res) => {
                if (category === 'satisfaction') {
                    setData([...res].sort((a, b) => b.ball - a.ball));
                } else {
                    setData(res);
                }
            })
            .catch((err) => console.error('Teacher rating error:', err))
            .finally(() => setLoading(false));
    }, [branchForFilter, category, year, month, showCurrentMonth]);

    const handleDateChange = (e) => {
        const fullDate = e.target.value;
        setDateValue(fullDate);
        if (fullDate) {
            const [y, m] = fullDate.split('-');
            setYear(y);
            setMonth(m);
            setShowCurrentMonth(false);
        }
    };

    const handleCurrentMonthToggle = (active) => {
        setShowCurrentMonth(active);
        if (active) {
            setDateValue('');
            setYear('');
            setMonth('');
        }
    };

    return {
        category,
        setCategory,
        dateValue,
        showCurrentMonth,
        data,
        loading,
        handleDateChange,
        handleCurrentMonthToggle,
    };
};
