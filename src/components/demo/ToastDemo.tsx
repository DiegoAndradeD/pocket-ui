import { ComponentCard } from "../ComponentCard";
import { Button } from "../ui/Button";
import { dismissAll, toast } from "../ui/toast";

export function ToastDemo() {
  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      <ComponentCard
        title="Variants"
        description="The built-in severity variants using the shorthand methods."
        code={`
          import { toast } from "@/components/ui/Toast";

          export default function App() {
            return (
              <div className="flex gap-4">
                <Button onClick={() => toast("Event created")}>Default</Button>
                <Button onClick={() => toast.success("File uploaded")}>Success</Button>
                <Button onClick={() => toast.error("Connection failed")}>Error</Button>
                <Button onClick={() => toast.warning("Low disk space")}>Warning</Button>
                <Button onClick={() => toast.info("Update available")}>Info</Button>
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => toast("Event has been created")}>
            Default
          </Button>
          <Button
            variant="outline"
            className="border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10"
            onClick={() => toast.success("File uploaded successfully")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            className="border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
            onClick={() => toast.error("Network connection failed")}
          >
            Error
          </Button>
          <Button
            variant="outline"
            className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            onClick={() => toast.warning("Disk space is running low")}
          >
            Warning
          </Button>
          <Button
            variant="outline"
            className="border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
            onClick={() => toast.info("A new software update is available")}
          >
            Info
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Rich Content"
        description="Add secondary descriptions or actionable buttons to your toasts."
        code={`
          import { toast } from "@/components/ui/Toast";

          export default function App() {
            return (
              <div className="flex gap-4">
                <Button
                  onClick={() => toast("Scheduled: Catch up", {
                    description: "Friday, April 3, 2026 at 4:46 PM",
                  })}
                >
                  With Description
                </Button>

                <Button
                  onClick={() => toast.warning("Delete 'project.tsx'?", {
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo clicked"),
                    },
                    duration: 8000,
                  })}
                >
                  With Action Button
                </Button>
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() =>
              toast("Meeting scheduled: Code Review", {
                description: "Friday, April 3, 2026 at 4:46 PM",
              })
            }
          >
            With Description
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              toast.error("File 'database.sqlite' deleted", {
                action: {
                  label: "Undo",
                  onClick: () => toast.success("File restored successfully"),
                },
                duration: 8000,
              })
            }
          >
            With Action
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Utilities"
        description="Manage the toast queue programmatically."
        code={`
          import { toast, dismissAll } from "@/components/ui/Toast";

          export default function App() {
            const spamToasts = () => {
              for (let i = 1; i <= 8; i++) {
                setTimeout(() => toast(\`Notification #\${i}\`), i * 100);
              }
            };

            return (
              <div className="flex gap-4">
                <Button onClick={spamToasts}>Spam Queue</Button>
                <Button variant="destructive" onClick={dismissAll}>Dismiss All</Button>
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              for (let i = 1; i <= 8; i++) {
                setTimeout(
                  () => toast(`Massive notification queue item #${i}`),
                  i * 100,
                );
              }
            }}
          >
            Spam Queue (Test Limit)
          </Button>

          <Button variant="destructive" onClick={dismissAll}>
            Dismiss All
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
}
