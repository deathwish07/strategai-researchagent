import { CheckCircle2, Loader2, Globe, Newspaper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentStep {
  name: string;
  status: "pending" | "active" | "complete";
  icon: React.ReactNode;
}

interface AgentProgressProps {
  steps: AgentStep[];
}

const AgentProgress = ({ steps }: AgentProgressProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="glass-card p-6 rounded-2xl glow-border">
        <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Agents Working
        </h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "agent-step flex items-center gap-4 p-4 rounded-lg transition-all",
                step.status === "active" && "bg-primary/10 border border-primary/20",
                step.status === "complete" && "bg-secondary",
                step.status === "pending" && "opacity-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                step.status === "active" && "bg-primary animate-glow-pulse",
                step.status === "complete" && "bg-accent",
                step.status === "pending" && "bg-muted"
              )}>
                {step.status === "active" && (
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                )}
                {step.status === "complete" && (
                  <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                )}
                {step.status === "pending" && (
                  <div className="w-5 h-5 text-muted-foreground">{step.icon}</div>
                )}
              </div>
              
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  step.status === "active" && "text-primary",
                  step.status === "complete" && "text-foreground",
                  step.status === "pending" && "text-muted-foreground"
                )}>
                  {step.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentProgress;

export { Globe, Newspaper, Sparkles };