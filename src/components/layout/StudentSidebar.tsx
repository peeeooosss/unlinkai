"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Calendar,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Award,
  FileText,
  Settings,
  Clock,
  MessageSquare,
  GraduationCap,
  FolderOpen,
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", href: "/student-portal", icon: LayoutDashboard },
  { title: "My Courses", href: "/student-portal/courses", icon: BookOpen },
  { title: "Schedule", href: "/student-portal/schedule", icon: Clock },
  { title: "Assignments", href: "/student-portal/assignments", icon: ClipboardCheck },
  { title: "Quizzes", href: "/student-portal/quizzes", icon: HelpCircle },
  { title: "Grades", href: "/student-portal/grades", icon: GraduationCap },
  { title: "Discussions", href: "/student-portal/discussions", icon: MessageSquare },
  { title: "Resources", href: "/student-portal/resources", icon: FolderOpen },
  { title: "Attendance", href: "/student-portal/attendance", icon: Calendar },
  { title: "Announcements", href: "/student-portal/announcements", icon: Bell },
  { title: "Documents", href: "/student-portal/documents", icon: FileText },
];

export function StudentSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-0"
      }`}
    >
      <div className="flex h-full w-64 flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
          <Link href="/student-portal" className="flex items-center gap-2" aria-label="UniLinkAI Student Portal">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-purple-600">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {open && <span className="font-bold text-lg text-neutral-900">UniLinkAI</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-neutral-700 hover:bg-neutral-100"
            onClick={onToggle}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => onToggle()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-purple-600">
              {user?.image ? (
                <img src={user.image} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || "S"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{user?.name ?? "Student"}</p>
              <p className="text-[10px] text-neutral-500 capitalize">{user?.role ?? "student"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}