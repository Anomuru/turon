export const getRouteMain = () => 'home';
export const getRouteTaskManager = (id) => `taskManager/*`;
export const getRouteFilteredLeads = () => `filteredLeadsList/*`;

export const getRouteStudents = (id) => `students/*`;
export const getRouteCalendar = () => `calendar/*`;
export const getRouteGroups = (id) => `groups/*`;
export const getRouteRegister = () => `register`;
export const getRouteTeacher = (id) => `teacher/*`;
export const getRouteRooms = (id) => `rooms/*`;
export const getTeacherProfile = (id) => `teacher/teacherProfile/${id}`;
export const getVacancyPage = (id) => `vacancyPage`
export const getVacancyWorkPage = (id) => `vacancyPage/vacancyWorkPage/${id}`
export const getRoomsProfilePage = (id) => `rooms/roomsProfilePage/${id}`

export const getProfile = (id) => `students/profile/${id}`;
export const getRouteTimePage = (id) => `timeList`
export const getRouteUserProfile = (id) => `profile/${id}`
export const getEmployerPage = (id) => `employer/*`

// export const getEmployerCategory = () => `employer/category/*`
export const getEmployerProfile = (id) => `teacher/employerProfile/${id}`;

export const getTeacherSalary = (id) => `teacher/teacherProfile/:id/teacherSalaryPage/${id}`
export const getEmployerSalary = (id) => `teacher/employerProfile/:id/employerSalaryPage/${id}`
export const getEmployerSalaryInsideSource = (id, permission) => `teacher/employerProfile/:id/employerSalaryPage/:id/giveSalaryPage/${id}/${permission}`
export const getTeacherSalaryInsideSource = (id) => `teacher/teacherProfile/:id/teacherSalaryPage/:id/giveTeacherSalaryPage/${id}`

export const getClass = () => `class/*`

export const getFlow = (id) => `flows/*`

export const getContract = (id) => `contract`

export const getCapital = (id) => `capital/*`

export const getCapitalInside = (id) => `capital/capitalBoxProfile/${id}`

export const getDashboard = (id) => `dashboard`






export const getLocations = (id) => `location/${id}`
export const getBranch = (id) => `branches/${id}`

export const getRouteCreateGroup = () => `createGroup`

export const getEducation = (id) => `education/${id}`


export const getAccounting = (id) => `accounting/*`
export const getGroupQuarter = (id) => `groups/quarter`

export const getGroupQuarterShow = (id) => `groups/groupInfo/${id}/quarter/${id}`
export const getLessonTable = (id) => `groups/groupInfo/${id}/lessonTable/${id}`
export const getInkasatsiya = (id) => `inkasatsiya/*`
export const getGroupExams = (id) => `groups/exams`


export const getOtchot = () => `accounting/otchot/*`


export const getGroupHistory = (id) => `students/profile/history/${id}`

export const getRouteClassProfile = (id) => `groups/classProfile/${id}`
export const getCapitalCategoryProfile = (id) => `capital/capitalBoxProfile/:id/profile/${id}`
export const getRouteRGBData = () => `students/RGBData/*`
export const getRouteStudentAttendance = () => `students/attendance/*`
export const getQuarterMaster = () => `quarterMaster`

export const getGroupObserve = (id) => `time/observe/${id}`
export const getCvSubmissons = (id) => `cvShow`
export const getHomeMessage = (id) => `messages`
export const getHomeNews = (id) => `news`
export const getParty = (id) => `party/*`
export const getTeacherObservation = () => `teacherObservation`
export const getLessonPlan = () => `lessonPlan`
export const classView = (id) => `time/classView`
export const questionnaire = (id) => `questionnaire`
export const grades = (id) => `groups/groupInfo/${id}/grades`
export const flowGrades = (id) => `flow/flowInfo/${id}/grades`



