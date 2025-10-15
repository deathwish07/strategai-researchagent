import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Newspaper, FileText, Calendar } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    companyName: string;
    websiteData?: {
      domain?: string;
      description?: string;
      foundedYear?: string;
      industry?: string;
    };
    newsData?: {
      articles?: Array<{
        title?: string;
        source?: string;
        date?: string;
        summary?: string;
      }>;
    };
    summary?: string;
    createdAt?: string;
  };
}

const ReportCard = ({ report }: ReportCardProps) => {
  const website = report.websiteData || {};
  const news = report.newsData?.articles || [];
  const summaryText = report.summary || "No summary available.";
  const createdAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl glow-border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2 glow-text">
              {report.companyName || "Unknown Company"}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{createdAt}</span>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground">
            AI Generated
          </Badge>
        </div>
      </div>

      {/* Website Data */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            Company Information
          </CardTitle>
          <CardDescription>
            {website.domain || "No domain information available."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-foreground">
            {website.description || "No description available."}
          </p>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-muted-foreground text-sm">Founded</span>
              <p className="font-semibold">{website.foundedYear || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Industry</span>
              <p className="font-semibold">{website.industry || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Data */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-accent" />
            </div>
            Recent News
          </CardTitle>
          <CardDescription>Latest updates and articles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-secondary/50 space-y-2"
              >
                <h4 className="font-semibold text-foreground">
                  {article.title || "Untitled"}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.source || "Unknown source"}</span>
                  {article.date && (
                    <>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {article.summary || "No summary available."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No news articles found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow-pulse">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            Executive Summary
          </CardTitle>
          <CardDescription>AI-generated comprehensive analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            {summaryText
              .split("\n")
              .filter((p) => p.trim())
              .map((paragraph, index) => (
                <p key={index} className="text-foreground mb-4">
                  {paragraph}
                </p>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCard;
