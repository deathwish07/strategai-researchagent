import { ReactElement } from "react";
import { Check, Loader2, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui progress component

// Define a clearer type for agent steps
interface AgentStep {
  name: string;
  status: "pending" | "active" | "complete";
  icon: ReactElement;
}

interface AgentProgressProps {
  steps: AgentStep[];
}

// A map for status-specific text and icons for better readability
const statusConfig = {
  complete: {
    text: "Completed",
    Icon: Check,
    className: "bg-green-500/20 text-green-500 border-green-500/30",
    iconColor: "bg-green-500",
  },
  active: {
    text: "In progress...",
    Icon: Loader2,
    className: "bg-primary/10 text-primary border-primary/30",
    iconColor: "bg-primary",
  },
  pending: {
    text: "Queued",
    Icon: ChevronsRight,
    className: "bg-secondary text-muted-foreground border-border",
    iconColor: "bg-muted",
  },
};

const AgentProgress = ({ steps }: AgentProgressProps) => {
  const completedSteps = steps.filter(
    (step) => step.status === "complete"
  ).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="p-6 border rounded-2xl glass-card glow-border">
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold font-display">
            AI Agents at Work
          </h3>
          <p className="text-sm text-muted-foreground">
            Generating your report, please wait...
          </p>
          <Progress value={progressPercentage} className="mt-4" />
        </div>

        <div className="relative space-y-2">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-border -translate-x-1/2" />

          {steps.map((step, index) => {
            const currentStatus = statusConfig[step.status];
            const StatusIcon = currentStatus.Icon;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex items-start gap-4 p-3 pr-4 transition-all duration-300 border rounded-lg",
                  currentStatus.className
                )}
              >
                {/* Status and Icon circle */}
                <div
                  className={cn(
                    "z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                    currentStatus.iconColor
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "w-5 h-5 text-primary-foreground",
                      step.status === "active" && "animate-spin"
                    )}
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 pt-1.5">
                  <p className="font-medium text-foreground">{step.name}</p>
                  <p className="text-sm">{currentStatus.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentProgress;
