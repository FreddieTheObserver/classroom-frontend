import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Building2, BookOpen } from 'lucide-react';

const items = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/departments', label: 'Departments', icon: Building2, end: false },
    { to: '/admin/subjects', label: 'Subjects', icon: BookOpen, end: false },
];

export function AdminSidebar() {
    return (
        <aside className="w-60 shrink-0 border-r bg-muted/30 min-h-screen">
            <div className="p-4 font-semibold text-lg border-b">
                Classroom Admin
            </div>

            <nav className="p-2 space-y-1">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                            "hover:bg-muted",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}>
                            <item.icon className="size-4">
                                {item.label}
                            </item.icon>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}