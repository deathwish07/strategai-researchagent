import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Newspaper,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Link as LinkIcon,
} from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    companyName: string;
    websiteData?: {
      domain?: string;
      description?: string;
      foundedYear?: string;
      industry?: string;
      headquarters?: string;
      keyPeople?: string[];
    };
    newsData?: {
      articles?: Array<{
        title?: string;
        source?: string;
        date?: string;
        summary?: string;
      }>;
    };
    financialData?: {
      revenue?: string;
      employees?: string;
      marketCap?: string;
      stockSymbol?: string;
    };
    competitors?: Array<{
      name?: string;
      description?: string;
    }>;
    sourceLinks?: Array<{
      title?: string;
      url?: string;
    }>;
    summary?: string;
    createdAt?: string;
  };
}

const ReportCard = ({ report }: ReportCardProps) => {
  const website = report.websiteData || {};
  const news = report.newsData?.articles || [];
  const financials = report.financialData || {};
  const competitors = report.competitors || [];
  const sources = report.sourceLinks || [];
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
            <div>
              <span className="text-muted-foreground text-sm">
                Headquarters
              </span>
              <p className="font-semibold">
                {website.headquarters || "Unknown"}
              </p>
            </div>
          </div>
          {website.keyPeople && website.keyPeople.length > 0 && (
            <div>
              <span className="text-muted-foreground text-sm">Key People</span>
              <ul className="list-disc list-inside text-foreground">
                {website.keyPeople.map((person, index) => (
                  <li key={index}>{person}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Data */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            Financial Overview
          </CardTitle>
          <CardDescription>Key company financial details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-muted-foreground text-sm">Revenue</span>
            <p className="font-semibold">{financials.revenue || "Unknown"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Employees</span>
            <p className="font-semibold">{financials.employees || "Unknown"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Market Cap</span>
            <p className="font-semibold">{financials.marketCap || "Unknown"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Stock Symbol</span>
            <p className="font-semibold">
              {financials.stockSymbol || "Unknown"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            Competitors
          </CardTitle>
          <CardDescription>Rivals and similar companies</CardDescription>
        </CardHeader>
        <CardContent>
          {competitors.length > 0 ? (
            <ul className="space-y-2">
              {competitors.map((comp, index) => (
                <li key={index}>
                  <p className="font-semibold text-foreground">
                    {comp.name || "Unnamed competitor"}
                  </p>
                  {comp.description && (
                    <p className="text-muted-foreground text-sm">
                      {comp.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">
              No competitors listed.
            </p>
          )}
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

      {/* Source Links */}
      <Card className="glass-card border-border hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-purple-500" />
            </div>
            Sources & References
          </CardTitle>
          <CardDescription>AI used these information sources</CardDescription>
        </CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <ul className="list-disc list-inside text-foreground space-y-1">
              {sources.map((src, index) => (
                <li key={index}>
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {src.title || src.url}
                    </a>
                  ) : (
                    src.title || "Unnamed source"
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No sources listed.</p>
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
