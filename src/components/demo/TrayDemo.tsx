import { ComponentCard } from "../ComponentCard";
import { Button } from "../ui/Button";
import Tray from "../ui/Tray";

export function TrayDemo() {
  return (
    <div className="w-full flex flex-col gap-12 pb-20">
      <ComponentCard
        title="Expansion Directions"
        description="The tray can expand in four directions. The animation origin automatically adapts."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full place-items-center mt-8">
          <Tray
            direction="down"
            align="center"
            trigger={<span className="font-medium">Down</span>}
          >
            <TrayItem icon={<HomeIcon />} label="Home" />
            <TrayItem icon={<UserIcon />} label="Profile" />
          </Tray>

          <Tray
            direction="up"
            align="center"
            trigger={<span className="font-medium">Up</span>}
          >
            <TrayItem icon={<HomeIcon />} label="Home" />
            <TrayItem icon={<UserIcon />} label="Profile" />
          </Tray>

          <Tray
            direction="right"
            align="center"
            trigger={<span className="font-medium">Right</span>}
          >
            <TrayItem icon={<HomeIcon />} />
            <TrayItem icon={<UserIcon />} />
            <TrayItem icon={<SettingsIcon />} />
          </Tray>

          <Tray
            direction="left"
            align="center"
            trigger={<span className="font-medium">Left</span>}
          >
            <TrayItem icon={<HomeIcon />} />
            <TrayItem icon={<UserIcon />} />
            <TrayItem icon={<SettingsIcon />} />
          </Tray>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Triggers: Click vs Hover"
        description="Change how the user interacts with the tray."
      >
        <div className="flex flex-wrap justify-center gap-16 w-full">
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Requires Click (Default)
            </span>
            <Tray
              expand="click"
              trigger={<Button variant="outline">Click Me</Button>}
            >
              <div className="p-3 text-sm min-w-37.5">
                <p className="font-medium mb-1">Click Mode</p>
                <p className="text-muted-foreground text-xs">
                  Stays open until you click outside or select an option.
                </p>
              </div>
            </Tray>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hover with Delay
            </span>
            <Tray
              expand="hover"
              trigger={<Button variant="secondary">Hover Me</Button>}
            >
              <div className="p-3 text-sm min-w-37.5">
                <p className="font-medium mb-1">Hover Mode</p>
                <p className="text-muted-foreground text-xs">
                  Closes automatically when mouse leaves, after a short delay.
                </p>
              </div>
            </Tray>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Practical Use Case: User Menu"
        description="Using the 'alternative' variant with custom alignment for a clean UI."
      >
        <div className="flex w-full justify-end border rounded-xl p-4 bg-muted/20">
          <Tray
            direction="down"
            align="end"
            variant="alternative"
            trigger={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  JD
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
            }
          >
            <div className="flex flex-col min-w-50">
              <div className="px-3 py-2 border-b border-primary-foreground/20 mb-1">
                <p className="text-sm font-medium text-primary-foreground">
                  john.doe@example.com
                </p>
                <p className="text-xs text-primary-foreground/60">
                  Administrator
                </p>
              </div>
              <TrayItem icon={<UserIcon />} label="Account Settings" isAlt />
              <TrayItem icon={<SettingsIcon />} label="Preferences" isAlt />
              <div className="h-px bg-primary-foreground/20 my-1 mx-2" />
              <TrayItem
                icon={<LogOutIcon />}
                label="Sign Out"
                isAlt
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              />
            </div>
          </Tray>
        </div>
      </ComponentCard>
    </div>
  );
}

function TrayItem({
  icon,
  label,
  isAlt,
  className,
}: {
  icon: React.ReactNode;
  label?: string;
  isAlt?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`
      flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left
      ${
        isAlt
          ? "hover:bg-primary-foreground/10 text-primary-foreground"
          : "hover:bg-muted text-foreground"
      }
      ${className || ""}
    `}
    >
      <span
        className={
          isAlt ? "text-primary-foreground/70" : "text-muted-foreground"
        }
      >
        {icon}
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
