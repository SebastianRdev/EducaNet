import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5047/api',
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (email, password) => apiClient.post('/auth/register', { email, password }),
};

export const courseService = {
    getAll: (page, status, search) => apiClient.get('/courses/search', { params: { page, status, q: search } }),
    getById: (id) => apiClient.get(`/courses/${id}`),
    getSummary: (id) => apiClient.get(`/courses/${id}/summary`),
    create: (data) => apiClient.post('/courses', data),
    update: (id, data) => apiClient.put(`/courses/${id}`, data),
    delete: (id) => apiClient.delete(`/courses/${id}`),
    publish: (id) => apiClient.patch(`/courses/${id}/publish`),
    unpublish: (id) => apiClient.patch(`/courses/${id}/unpublish`),
};

export const lessonService = {
    getByCourseId: (courseId) => apiClient.get(`/lessons/course/${courseId}`),
    create: (data) => apiClient.post('/lessons', data),
    update: (id, data) => apiClient.put(`/lessons/${id}`, data),
    delete: (id) => apiClient.delete(`/lessons/${id}`),
    reorder: (id, newOrder) => apiClient.patch(`/lessons/${id}/reorder`, newOrder, { headers: { 'Content-Type': 'application/json' } }),
};

// Unified API object for easier consumption
export const api = {
    // Auth
    login: async (email, password) => {
        const response = await authService.login(email, password);
        return response.data;
    },
    register: async (email, password) => {
        const response = await authService.register(email, password);
        return response.data;
    },

    // Courses
    getCourses: async (page = 1, status = '', search = '') => {
        const response = await courseService.getAll(page, status, search);
        return response.data;
    },
    getCourse: async (id) => {
        const response = await courseService.getById(id);
        return response.data;
    },
    createCourse: async (data) => {
        const response = await courseService.create(data);
        return response.data;
    },
    updateCourse: async (id, data) => {
        const response = await courseService.update(id, data);
        return response.data;
    },
    deleteCourse: async (id) => {
        const response = await courseService.delete(id);
        return response.data;
    },
    publishCourse: async (id) => {
        const response = await courseService.publish(id);
        return response.data;
    },
    unpublishCourse: async (id) => {
        const response = await courseService.unpublish(id);
        return response.data;
    },

    // Lessons
    getLessons: async (courseId) => {
        const response = await lessonService.getByCourseId(courseId);
        return response.data;
    },
    createLesson: async (courseId, data) => {
        const response = await lessonService.create({
            CourseId: courseId,
            Title: data.title,
            Order: data.order,
            Content: data.content || ""
        });
        return response.data;
    },
    updateLesson: async (courseId, lessonId, data) => {
        const response = await lessonService.update(lessonId, {
            Title: data.title,
            Order: data.order,
            Content: data.content || ""
        });
        return response.data;
    },
    deleteLesson: async (courseId, lessonId) => {
        const response = await lessonService.delete(lessonId);
        return response.data;
    },
    reorderLesson: async (lessonId, newOrder) => {
        const response = await lessonService.reorder(lessonId, newOrder);
        return response.data;
    },
};
