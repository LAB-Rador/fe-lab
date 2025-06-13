"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/src/components/sidebar-provider"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import type React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  LayoutDashboard,
  FlaskRoundIcon as Flask,
  Rat,
  ClipboardList,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react"

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const params = useParams();
  const { userId, labId } = params;
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    router.replace('/');
  }

  return (
    <div className={cn("sticky top-0 z-50 h-screen border-r bg-white transition-all duration-300", isOpen ? "w-64" : "w-16")}>
      <div className="flex h-16 items-center justify-between px-4">
        <div className={cn("flex items-center", isOpen ? "justify-start" : "justify-center w-full")}>
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div onClick={toggle} className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span className="font-bold text-lg">LabAssist</span>
            </div>
          ) : (
            <div onClick={toggle} className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", !isOpen && "hidden")} onClick={toggle}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-3 py-2">
          <nav className="flex flex-col gap-1">
            <NavItem
              href={`/${userId}/${labId}/dashboard`}
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={pathname === `/${userId}/${labId}/dashboard`}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${userId}/${labId}/animals`}
              icon={Rat}
              label="Animals"
              isActive={pathname.startsWith(`/${userId}/${labId}/animals`)}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${userId}/${labId}/experiments`}
              icon={Flask}
              label="Experiments"
              isActive={pathname.startsWith(`/${userId}/${labId}/experiments`)}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${userId}/${labId}/tasks`}
              icon={ClipboardList}
              label="Tasks"
              isActive={pathname.startsWith(`/${userId}/${labId}/tasks`)}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${userId}/${labId}/reports`}
              icon={FileBarChart}
              label="Reports"
              isActive={pathname.startsWith(`/${userId}/${labId}/reports`)}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${userId}/${labId}/settings`}
              icon={Settings}
              label="Settings"
              isActive={pathname.startsWith(`/${userId}/${labId}/settings`)}
              isOpen={isOpen}
            />
          </nav>
        </div>
      </ScrollArea>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-gray-500 hover:text-gray-900", !isOpen && "justify-center px-0")}
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isOpen && <span>Log out</span>}
        </Button>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  isOpen: boolean
}

function NavItem({ href, icon: Icon, label, isActive, isOpen }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
        !isOpen && "justify-center px-0",
      )}
    >
      <Icon className="h-4 w-4" />
      {isOpen && <span>{label}</span>}
    </Link>
  )
}
