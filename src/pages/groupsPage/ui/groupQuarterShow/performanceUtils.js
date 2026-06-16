/**
 * Utility functions for student performance calculations
 */

export const calculateMedian = (arr) => {
    if (!arr || arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const calculateMean = (arr) => {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
};

/**
 * Transforms student data to subject-based summary
 * @param {Array} studentsData 
 * @returns {Array} List of subjects with median scores
 */
    export const getSubjectsSummary = (studentsData) => {
        if (!studentsData || studentsData.length === 0) return [];

        const subjectMap = {};

        studentsData.forEach(student => {
            student.subjects.forEach(subject => {
                if (!subjectMap[subject.subject_name]) {
                    subjectMap[subject.subject_name] = {
                        name: subject.subject_name,
                        scores: []
                    };
                }
                subjectMap[subject.subject_name].scores.push(subject.average_result);
            });
        });

        return Object.values(subjectMap).map(sub => ({
            id: sub.name,
            name: sub.name,
            median: calculateMedian(sub.scores),
            average: calculateMean(sub.scores)
        }));
    };

/**
 * Calculates student rankings based on mean of all subjects
 */
export const getStudentRankings = (studentsData) => {
    if (!studentsData) return [];

    const rankings = studentsData.map(student => {
        const scores = student.subjects.map(s => s.average_result);
        return {
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            average: calculateMean(scores)
        };
    });

    return rankings.sort((a, b) => b.average - a.average);
};

/**
 * Gets dynamics data for a subject
 * Assumes assignments are in chronological order
 */
export const getSubjectDynamics = (studentsData, subjectName) => {
    if (!studentsData || !subjectName) return [];

    // Collect all assignments across all students for this subject
    const assignmentsByTest = {}; // { test_name: [scores] }

    studentsData.forEach(student => {
        const subject = student.subjects.find(s => s.subject_name === subjectName);
        if (subject) {
            subject.assignments.forEach(task => {
                if (!assignmentsByTest[task.test_name]) {
                    assignmentsByTest[task.test_name] = [];
                }
                assignmentsByTest[task.test_name].push(task.percentage);
            });
        }
    });

    // Map to array and average scores per test
    return Object.entries(assignmentsByTest).map(([testName, scores]) => ({
        name: testName,
        score: calculateMean(scores)
    }));
};
