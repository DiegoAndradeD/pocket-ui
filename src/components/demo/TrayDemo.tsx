import { ComponentCard } from "../ComponentCard";
import { HomeIcon, UserIcon, SettingsIcon, LogOutIcon } from "../icons";
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
