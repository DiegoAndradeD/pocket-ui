import { useState } from "react";
import { ComponentCard } from "../ComponentCard";
import { Input } from "../ui/Input";
import {
  SearchIcon,
  MailIcon,
  LockIcon,
  EyeOffIcon,
  EyeIcon,
  UserIcon,
} from "../icons";

export function InputDemo() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col gap-8">
      <ComponentCard
        title="Variants"
        description="Different visual styles for the input field."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Default
            </span>
            <Input placeholder="Enter your name" variant="default" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Underlined
            </span>
            <Input placeholder="Enter your name" variant="underlined" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Flat
            </span>
            <Input placeholder="Enter your name" variant="flat" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Outline
            </span>
            <Input placeholder="Enter your name" variant="outline" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Content Slots"
        description="Add elements to the start or end of the input."
      >
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Input placeholder="Search..." startContent={<SearchIcon />} />

          <Input
            placeholder="Enter amount"
            type="number"
            startContent={<span className="text-sm font-medium">$</span>}
            endContent={
              <span className="text-xs text-muted-foreground">USD</span>
            }
          />

          <Input
            placeholder="example@email.com"
            type="email"
            startContent={<MailIcon />}
            endContent={
              <div className="flex items-center justify-center w-5 h-5 rounded bg-muted text-[10px] font-bold">
                ⌘K
              </div>
            }
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Practical Examples"
        description="Real-world usage like password toggles and custom wrapper styles."
      >
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            startContent={<LockIcon />}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          <Input
            placeholder="Custom styled wrapper..."
            startContent={<SearchIcon className="text-blue-500" />}
            classNames={{
              wrapper: "shadow-md rounded-full",
              input:
                "rounded-full border-blue-200 focus:border-blue-500 focus:ring-blue-500/20",
            }}
          />
        </div>
      </ComponentCard>

      <ComponentCard title="States" description="Loading and disabled states.">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Input placeholder="Saving changes..." isLoading />

          <Input
            placeholder="Verifying username..."
            startContent={<UserIcon />}
            endContent={<span className="text-green-500">Available</span>}
            isLoading
          />

          <Input
            placeholder="Disabled input"
            startContent={<MailIcon />}
            disabled
          />
        </div>
      </ComponentCard>
    </div>
  );
}
