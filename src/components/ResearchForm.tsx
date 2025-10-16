import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Loader2 } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (companyName: string) => void;
  isLoading: boolean;
}

// Pre-defined example queries to guide the user
const predefinedQueries = ["Nvidia", "Microsoft", "Tesla", "Apple"];

const ResearchForm = ({ onSubmit, isLoading }: ResearchFormProps) => {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && !isLoading) {
      onSubmit(companyName.trim());
    }
  };

  // Handler for clicking on a predefined query badge
  const handlePredefinedSubmit = (query: string) => {
    if (!isLoading) {
      setCompanyName(query);
      onSubmit(query);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none glass-card glow-border animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="mb-2 text-3xl font-bold font-display glow-text">
          AI Research Assistant
        </CardTitle>
        <CardDescription className="text-lg">
          Enter a company name to generate a comprehensive report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Search className="absolute w-5 h-5 left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., 'Nvidia' or 'openai.com'"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
              className="w-full h-14 pl-12 text-lg transition-all border-border bg-background/50 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !companyName.trim()}
            className="w-full h-14 text-lg font-semibold transition-all bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-lift"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </form>

        {/* Predefined query section */}
        <div className="mt-6 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Or try an example:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {predefinedQueries.map((query) => (
              <Badge
                key={query}
                variant="secondary"
                onClick={() => handlePredefinedSubmit(query)}
                className="px-3 py-1 text-sm transition-all cursor-pointer hover:bg-primary/20 hover:text-primary"
              >
                {query}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchForm;
