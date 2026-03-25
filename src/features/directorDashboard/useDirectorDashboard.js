import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { API_URL, headers, useHttp } from 'shared/api/base.js';
import { getCurrentBranch } from 'entities/oftenUsed/model/oftenUsedSelector.js';

const MONTHS = [
    { value: 1, label: 'Yanvar' },
    { value: 2, label: 'Fevral' },
    { value: 3, label: 'Mart' },
    { value: 4, label: 'Aprel' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Iyun' },
    { value: 7, label: 'Iyul' },
    { value: 8, label: 'Avgust' },
    { value: 9, label: 'Sentabr' },
    { value: 10, label: 'Oktabr' },
    { value: 11, label: 'Noyabr' },
    { value: 12, label: 'Dekabr' },
];

const RATING_CATEGORIES = [
    { value: 'observation', label: 'Kuzatuv' },
    { value: 'lesson_plan', label: 'Dars rejasi' },
    { value: 'student_results', label: "O'quvchi natijalari" },
    { value: 'satisfaction', label: "Qoniqish darajasi" },
    { value: 'contribution', label: 'Hissa (Contribution)' },
    { value: 'professionalism', label: 'Professionallik' },
    { value: 'pd', label: "Ma'ruzalar" },
    {value: "conduct", label: "Xulq-atvor (Conduct)"},
    {value: "responsiveness", label: "Fikr-mulohazalar (Feedback)"},
    {value: "collaboration", label: "Jamoaviy ish (Teamwork)"},
]

export { MONTHS, RATING_CATEGORIES };

export const useDirectorDashboard = () => {
    const { request } = useHttp();
    const currentBranch = useSelector(getCurrentBranch);

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const [selectedRatingCategory, setSelectedRatingCategory] = useState('observation');


    // Teacher ratings
    const [teacherRatings, setTeacherRatings] = useState([]);
    const [teacherRatingsLoading, setTeacherRatingsLoading] = useState(false);

    // Monthly student dynamics (joined / left)
    const [studentDynamics, setStudentDynamics] = useState([]);
    const [dynamicsLoading, setDynamicsLoading] = useState(false);

    // Left students analysis (pie)
    const [leftStudentsAnalysis, setLeftStudentsAnalysis] = useState([]);
    const [leftLoading, setLeftLoading] = useState(false);

    // Branch analysis
    const [branchAnalysis, setBranchAnalysis] = useState([]);
    const [branchLoading, setBranchLoading] = useState(false);

    // Student achievement share (yearly)
    const [achievementShare, setAchievementShare] = useState(null);
    const [achievementLoading, setAchievementLoading] = useState(false);

    const branchParam = currentBranch ? `&branch=${currentBranch}` : '';

    const fetchTeacherRatings = useCallback(() => {
        if (!currentBranch) return;
        setTeacherRatingsLoading(true);
        request(
            `${API_URL}Teachers/teacher-rating/?branch=${currentBranch}&category=${selectedRatingCategory}&year=${selectedYear}&month=${selectedMonth}`,
            'GET', null, headers()
        )
            .then(res => setTeacherRatings(Array.isArray(res) ? res.slice(0, 10) : []))
            .catch(() => setTeacherRatings([]))
            .finally(() => setTeacherRatingsLoading(false));
    }, [currentBranch, selectedMonth, selectedYear, selectedRatingCategory]);

    const fetchStudentDynamics = useCallback(async () => {
        setDynamicsLoading(true);
        try {
            const branchQ = currentBranch ? `&branch=${currentBranch}` : '';

            // Helper: paginate all results from an endpoint
            const fetchAll = async (baseUrl) => {
                const all = [];
                let url = baseUrl;
                while (url) {
                    const res = await request(url, 'GET', null, headers());
                    if (res?.results) all.push(...res.results);
                    url = res?.next || null;
                }
                return all;
            };

            // Fetch both in parallel
            const [joinedAll, leftAll] = await Promise.all([
                fetchAll(`${API_URL}Students/new-registered-students/?limit=100&offset=0${branchQ}&month=${selectedMonth}&year=${selectedYear}`),
                fetchAll(`${API_URL}Students/deleted-group-students/?limit=100&offset=0&language=null&age=-${branchQ}&month=${selectedMonth}&year=${selectedYear}`),
            ]);

            // Count days in selected month
            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
            const days = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, joined: 0, left: 0 }));

            // Try every possible date field (top-level and nested inside 'student')
            // API already filters by month/year so no prefix guard needed
            const DATE_FIELDS = ['created_date', 'date', 'registered_date', 'start_date', 'registration_date', 'created', 'join_date', 'joined_date'];
            const findDay = (obj) => {
                for (const field of DATE_FIELDS) {
                    const val = obj?.[field] || obj?.student?.[field] || '';
                    if (val && typeof val === 'string' && val.includes('-')) {
                        const parts = val.split('-');
                        if (parts.length >= 3) {
                            const d = parseInt(parts[2], 10);
                            if (d >= 1 && d <= daysInMonth) return d;
                        }
                    }
                }
                return null;
            };

            joinedAll.forEach(s => {
                const day = findDay(s);
                if (day) days[day - 1].joined += 1;
            });

            // Deleted students: deleted_date is the primary field, fallback to findDay
            leftAll.forEach(s => {
                const dateStr = s.deleted_date || '';
                if (dateStr && dateStr.includes('-')) {
                    const parts = dateStr.split('-');
                    if (parts.length >= 3) {
                        const d = parseInt(parts[2], 10);
                        if (d >= 1 && d <= daysInMonth) days[d - 1].left += 1;
                    }
                } else {
                    const day = findDay(s);
                    if (day) days[day - 1].left += 1;
                }
            });

            setStudentDynamics(days);
        } catch {
            setStudentDynamics([]);
        } finally {
            setDynamicsLoading(false);
        }
    }, [currentBranch, selectedMonth, selectedYear]);

    const fetchLeftStudentsAnalysis = useCallback(async () => {
        setLeftLoading(true);
        try {
            // Fetch all deleted students (paginate until no next page)
            let url = `${API_URL}Students/deleted-group-students/?branch=${currentBranch || ''}&limit=100&offset=0&language=null&age=-`;
            const allResults = [];
            while (url) {
                const res = await request(url, 'GET', null, headers());
                if (res?.results) allResults.push(...res.results);
                url = res?.next || null;
            }
            // Aggregate by group_reason.name
            const map = {};
            allResults.forEach(item => {
                const reason = item?.group_reason?.name || "Noma'lum";
                map[reason] = (map[reason] || 0) + 1;
            });
            const aggregated = Object.entries(map)
                .map(([reason, count]) => ({ reason, count }))
                .sort((a, b) => b.count - a.count);
            setLeftStudentsAnalysis(aggregated);
        } catch {
            setLeftStudentsAnalysis([]);
        } finally {
            setLeftLoading(false);
        }
    }, [currentBranch]);

    const fetchBranchAnalysis = useCallback(() => {
        setBranchLoading(true);
        request(
            `${API_URL}Students/branch-analysis/?year=${selectedYear}&month=${selectedMonth}`,
            'GET', null, headers()
        )
            .then(res => setBranchAnalysis(Array.isArray(res) ? res : []))
            .catch(() => setBranchAnalysis([]))
            .finally(() => setBranchLoading(false));
    }, [selectedMonth, selectedYear]);

    const fetchAchievementShare = useCallback(() => {
        setAchievementLoading(true);
        request(
            `${API_URL}Students/achievement-share/?year=${selectedYear}${branchParam}`,
            'GET', null, headers()
        )
            .then(res => setAchievementShare(res || null))
            .catch(() => setAchievementShare(null))
            .finally(() => setAchievementLoading(false));
    }, [currentBranch, selectedYear]);

    // Re-fetch everything when month / year / branch changes
    useEffect(() => {
        fetchTeacherRatings();
        fetchStudentDynamics();
        fetchLeftStudentsAnalysis();
        fetchBranchAnalysis();
        fetchAchievementShare();
    }, [selectedMonth, selectedYear, currentBranch]);

    // Re-fetch only teacher ratings when category changes
    useEffect(() => {
        fetchTeacherRatings();
    }, [selectedRatingCategory]);

    return {
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        teacherRatings,
        teacherRatingsLoading,
        studentDynamics,
        dynamicsLoading,
        leftStudentsAnalysis,
        leftLoading,
        branchAnalysis,
        branchLoading,
        achievementShare,
        achievementLoading,
        selectedRatingCategory,
        setSelectedRatingCategory
    };
};
