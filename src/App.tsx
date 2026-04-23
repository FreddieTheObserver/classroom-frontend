import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { DepartmentsPage } from "./pages/admin/DepartmentsPage";
import { SubjectsPage } from "./pages/admin/SubjectsPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

const dashboardPath = {
    ADMIN: "/admin",
    TEACHER: "/teacher",
    STUDENT: "/student",
} as const;

function RootRedirect() {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="p-8">Loading…</div>;
    return <Navigate to={user ? dashboardPath[user.role] : "/login"} replace />;
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute role="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="departments" element={<DepartmentsPage />} />
                    <Route path="subjects" element={<SubjectsPage />} />
                </Route>
            </Route>
            <Route element={<ProtectedRoute role="TEACHER" />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
            </Route>
            <Route element={<ProtectedRoute role="STUDENT" />}>
                <Route path="/student" element={<StudentDashboard />} />
            </Route>
            <Route path="*" element={<div className="p-8">404 — not found</div>} />
        </Routes>
    );
}