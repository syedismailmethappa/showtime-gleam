import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  Ticket,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/events', icon: Calendar, label: 'Events' },
  { path: '/admin/bookings', icon: Ticket, label: 'Bookings' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
  const { signOut, user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className="h-screen glass-strong border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center neon-glow shrink-0">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-gradient">Admin</span>
          )}
        </div>
        {!collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                collapsed && "justify-center",
                isActive
                  ? "bg-primary/20 text-primary neon-glow"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle (when collapsed) */}
      {collapsed && (
        <div className="p-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="w-full h-10 rounded-lg glass flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
};

export default AdminSidebar;
