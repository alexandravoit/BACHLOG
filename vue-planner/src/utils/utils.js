export async function fetchCoursesForSemester(semester) {
  try {
    const response = await fetch(`http://localhost:3000/api/courses?semester=${semester}`);
    const courses = await response.json();
    return courses.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      credits: course.credits,
      season: course.season,
      grade: course.grade,
      comments: course.comments,
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function updateCourseSemester(courseId, semester) {
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ semester }),
    });
    const data = await response.json();
    console.log('Course updated:', data);
  } catch (error) {
    console.error('Error updating course:', error);
  }
}

export async function getSemester(courseCode) {
  try {
    const response = await fetch(`http://localhost:5001/course/${courseCode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const semester = await response.json();
    console.log('Fetched semester info:', semester);
    return semester;
  } catch (error) {
    console.error('Error getting semester:', error);
    return null;
  }
}

export async function saveCourseDetails(courseId, details) {
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${courseId}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error saving course details:", error);
      throw error;
    }
}

export function isValidSemester(course, semesterId) {
    const isAutumnCourse = course.season === 'sügis';
    const isSpringCourse = course.season === 'kevad';
    if (isAutumnCourse && semesterId % 2 !== 0) {
      return true;
    }
    if (isSpringCourse && semesterId % 2 == 0) {
      return true;
    }
    return false;
}