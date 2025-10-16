import { useState, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import ResearchForm from "@/components/ResearchForm";
import AgentProgress from "@/components/AgentProgress";
import ReportCard from "@/components/ReportCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe,
  Newspaper,
  Sparkles,
  Search,
  AlertTriangle,
} from "lucide-react";

// Define clear types for our component's state
type ReportStatus = "idle" | "loading" | "success" | "error";

interface AgentStep {
  name: string;
  status: "pending" | "active" | "complete";
  icon: ReactElement;
}

// Configuration for the agent steps
const AGENT_CONFIG: Omit<AgentStep, "status">[] = [
  { name: "Web Research Agent", icon: <Globe className="w-5 h-5" /> },
  { name: "News Analysis Agent", icon: <Newspaper className="w-5 h-5" /> },
  { name: "AI Summary Agent", icon: <Sparkles className="w-5 h-5" /> },
];

const Index = () => {
  const [status, setStatus] = useState<ReportStatus>("idle");
  const [report, setReport] = useState<any>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const runAgentSimulation = async () => {
    const totalSteps = AGENT_CONFIG.length;
    for (let i = 0; i < totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 750));
      setAgentSteps((prevSteps) =>
        prevSteps.map((step, index) => {
          if (index <= i) return { ...step, status: "complete" };
          if (index === i + 1) return { ...step, status: "active" };
          return step;
        })
      );
    }
  };

  const handleResearch = async (companyName: string) => {
    setStatus("loading");
    setReport(null);
    setErrorMessage("");
    const initialSteps = AGENT_CONFIG.map((step, index) => ({
      ...step,
      status: index === 0 ? "active" : "pending",
    }));
    setAgentSteps(initialSteps);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to generate reports.",
          variant: "destructive",
        });
        navigate("/auth");
        setStatus("idle");
        return;
      }

      const [apiResponse] = await Promise.all([
        supabase.functions.invoke("super-responder", { body: { companyName } }),
        runAgentSimulation(),
      ]);

      if (apiResponse.error) throw apiResponse.error;

      setReport(apiResponse.data.report);
      setStatus("success");
      toast({
        title: "Research Complete!",
        description: `Successfully generated report for ${companyName}.`,
      });
    } catch (error: any) {
      console.error("Research error:", error);
      const message =
        error.message ||
        "An unknown error occurred while generating the report.";
      setErrorMessage(message);
      setStatus("error");
      toast({
        title: "Research Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setReport(null);
    setAgentSteps([]);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold sm:text-6xl font-display glow-text">
            AI-Powered Research
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Generate comprehensive company research reports using OpenAI.
          </p>
        </div>

        {status !== "success" && (
          <ResearchForm
            onSubmit={handleResearch}
            isLoading={status === "loading"}
          />
        )}

        {status === "loading" && <AgentProgress steps={agentSteps} />}

        {status === "error" && (
          <div className="max-w-2xl p-6 mx-auto mt-8 text-center border rounded-lg bg-destructive/10 border-destructive/30">
            <AlertTriangle className="mx-auto mb-4 w-9 h-9 text-destructive" />
            <h3 className="mb-2 text-xl font-semibold text-destructive-foreground">
              Generation Failed
            </h3>
            <p className="text-destructive-foreground/80">{errorMessage}</p>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="mt-6"
            >
              <Search className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        )}

        {status === "success" && report && (
          <div className="mt-12 animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <Button onClick={handleReset} variant="outline" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Start New Research
              </Button>
            </div>
            <ReportCard report={report} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
