import { cn } from "../../lib/utils";
import { ComponentCard } from "../ComponentCard";
import {
  SettingsIcon,
  HomeIcon,
  AnalyticsIcon,
  UsersIcon,
  FolderIcon,
  FileTextIcon,
  BellIcon,
  MessageIcon,
  ActivityIcon,
  ArchiveIcon,
} from "../icons";
import Sidebar from "../ui/Sidebar";

export function SidebarDemo() {
  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      <ComponentCard
        title="Default Sidebar (Button Collapse)"
        description="A standard left-side navigation with a button toggle. Notice how the text smoothly clips when collapsed."
      >
        <div className="w-full h-100 border border-border rounded-xl overflow-hidden flex bg-muted/10 relative">
          <Sidebar
            side="left"
            collapse="button"
            header={(collapsed) => (
              <div className="flex items-center gap-2 h-14 px-4">
                <div className="shrink-0 flex items-center justify-center bg-primary text-primary-foreground rounded-md w-6 h-6 font-bold text-xs">
                  P
                </div>
                {!collapsed && (
                  <span className="font-bold tracking-tight truncate">
                    Pocket UI
                  </span>
                )}
              </div>
            )}
            footer={() => (
              <div className="p-3">
                <NavItem icon={<SettingsIcon />} label="Settings" />
              </div>
            )}
          >
            <div className="p-3 flex flex-col gap-1">
              <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-2 truncate">
                Dashboard
              </span>
              <NavItem icon={<HomeIcon />} label="Overview" active />
              <NavItem icon={<AnalyticsIcon />} label="Analytics" />
              <NavItem icon={<UsersIcon />} label="Customers" />

              <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-4 truncate">
                Content
              </span>
              <NavItem icon={<FolderIcon />} label="Projects" />
              <NavItem icon={<FileTextIcon />} label="Documents" />
            </div>
          </Sidebar>

          <div className="flex-1 p-8 flex flex-col gap-4">
            <div className="w-1/3 h-8 bg-muted rounded-md animate-pulse" />
            <div className="w-full h-32 bg-muted/50 rounded-xl" />
            <div className="w-2/3 h-4 bg-muted rounded-md" />
            <div className="w-1/2 h-4 bg-muted rounded-md" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Alternative & Right Side (Hover)"
        description="Expands automatically on hover. Positioned on the right with the alternative color scheme."
      >
        <div className="w-full h-100 border border-border rounded-xl overflow-hidden flex bg-background relative">
          <div className="flex-1 p-8 flex flex-col items-end gap-4 text-right">
            <h3 className="font-semibold text-lg">Hover the right edge ➔</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              This layout is great for secondary tool panels, property
              inspectors, or messaging sidebars.
            </p>
          </div>

          <Sidebar
            side="right"
            collapse="hover"
            variant="alternative"
            defaultOpen={false}
            header={(collapsed) => (
              <div className="flex items-center gap-2 h-14 px-4">
                <BellIcon className="shrink-0 w-5 h-5 text-primary-foreground/70" />
                {!collapsed && (
                  <span className="font-medium text-primary-foreground truncate">
                    Notifications
                  </span>
                )}
              </div>
            )}
          >
            <div className="p-3 flex flex-col gap-1">
              <NavItem icon={<MessageIcon />} label="Messages" isAlt />
              <NavItem icon={<ActivityIcon />} label="Activity Log" isAlt />
              <NavItem icon={<ArchiveIcon />} label="Archived" isAlt />
            </div>
          </Sidebar>
        </div>
      </ComponentCard>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isAlt?: boolean;
}

function NavItem({ icon, label, active, isAlt }: NavItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap cursor-pointer",
        !isAlt &&
          !active &&
          "text-muted-foreground hover:text-foreground hover:bg-muted",
        !isAlt && active && "bg-muted text-foreground font-medium",
        isAlt &&
          !active &&
          "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
        isAlt &&
          active &&
          "bg-primary-foreground/20 text-primary-foreground font-medium",
      )}
    >
      <span className="shrink-0 flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      <span className="truncate text-left flex-1">{label}</span>
    </button>
  );
}
