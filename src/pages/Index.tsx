import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ResearchForm from "@/components/ResearchForm";
import AgentProgress, {
  Globe,
  Newspaper,
  Sparkles,
} from "@/components/AgentProgress";
import ReportCard from "@/components/ReportCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [agentSteps, setAgentSteps] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResearch = async (companyName: string) => {
    setIsLoading(true);
    setCurrentReport(null);

    // Initialize agent steps
    setAgentSteps([
      {
        name: "Web Research Agent",
        status: "active",
        icon: <Globe className="w-5 h-5" />,
      },
      {
        name: "News Analysis Agent",
        status: "pending",
        icon: <Newspaper className="w-5 h-5" />,
      },
      {
        name: "AI Summary Agent",
        status: "pending",
        icon: <Sparkles className="w-5 h-5" />,
      },
    ]);

    try {
      // Check authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to generate reports",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Simulate agent progress
      setTimeout(() => {
        setAgentSteps([
          {
            name: "Web Research Agent",
            status: "complete",
            icon: <Globe className="w-5 h-5" />,
          },
          {
            name: "News Analysis Agent",
            status: "active",
            icon: <Newspaper className="w-5 h-5" />,
          },
          {
            name: "AI Summary Agent",
            status: "pending",
            icon: <Sparkles className="w-5 h-5" />,
          },
        ]);
      }, 1000);

      setTimeout(() => {
        setAgentSteps([
          {
            name: "Web Research Agent",
            status: "complete",
            icon: <Globe className="w-5 h-5" />,
          },
          {
            name: "News Analysis Agent",
            status: "complete",
            icon: <Newspaper className="w-5 h-5" />,
          },
          {
            name: "AI Summary Agent",
            status: "active",
            icon: <Sparkles className="w-5 h-5" />,
          },
        ]);
      }, 2000);

      const { data, error } = await supabase.functions.invoke(
        "super-responder",
        {
          body: { companyName },
        }
      );

      if (error) throw error;

      setAgentSteps([
        {
          name: "Web Research Agent",
          status: "complete",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          name: "News Analysis Agent",
          status: "complete",
          icon: <Newspaper className="w-5 h-5" />,
        },
        {
          name: "AI Summary Agent",
          status: "complete",
          icon: <Sparkles className="w-5 h-5" />,
        },
      ]);

      setCurrentReport(data.report);

      toast({
        title: "Research Complete!",
        description: `Successfully generated report for ${companyName}`,
      });
    } catch (error: any) {
      console.error("Research error:", error);
      toast({
        title: "Research Failed",
        description: error.message || "Failed to generate research report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4 glow-text">
            AI-Powered Research
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive company research reports using advanced AI
            agents
          </p>
        </div>

        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {agentSteps.length > 0 && <AgentProgress steps={agentSteps} />}

        {currentReport && (
          <div className="mt-12">
            <ReportCard report={currentReport} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
