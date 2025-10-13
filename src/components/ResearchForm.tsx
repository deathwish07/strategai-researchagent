import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (companyName: string) => void;
  isLoading: boolean;
}

const ResearchForm = ({ onSubmit, isLoading }: ResearchFormProps) => {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSubmit(companyName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-8 rounded-2xl glow-border">
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-2 glow-text">
            AI Research Assistant
          </h2>
          <p className="text-muted-foreground">
            Enter a company name to generate a comprehensive research report
          </p>
        </div>

        <div className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
              className="pl-12 h-14 text-lg bg-secondary border-border focus:border-primary transition-all"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className="h-14 px-8 font-semibold text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover-lift"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Researching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ResearchForm;