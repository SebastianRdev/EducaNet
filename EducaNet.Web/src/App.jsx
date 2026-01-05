import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Lessons from './pages/Lessons';
import CourseEditor from './pages/CourseEditor';
import CourseLessons from './pages/CourseLessons';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    // Enable dark mode by default
    if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
    }

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/courses" element={
                        <PrivateRoute>
                            <Courses />
                        </PrivateRoute>
                    } />
                    <Route path="/lessons" element={
                        <PrivateRoute>
                            <Lessons />
                        </PrivateRoute>
                    } />
                    <Route path="/course-editor/:courseId" element={
                        <PrivateRoute>
                            <CourseEditor />
                        </PrivateRoute>
                    } />
                    <Route path="/course-lessons/:courseId" element={
                        <PrivateRoute>
                            <CourseLessons />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
