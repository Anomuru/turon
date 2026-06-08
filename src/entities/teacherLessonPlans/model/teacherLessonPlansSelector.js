export const getTeacherLessonPlans = (state) => state.teacherLessonPlansSlice?.lessonPlans || [];
export const getTeacherLessonPlansLoading = (state) => state.teacherLessonPlansSlice?.loading || false;
export const getTeacherLessonPlansError = (state) => state.teacherLessonPlansSlice?.error || null;
