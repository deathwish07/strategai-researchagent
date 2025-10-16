// @ts-nocheck
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Newspaper,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Link as LinkIcon,
  Building,
  Briefcase,
  TrendingUp,
  Info,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define a more specific type for icon components
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    size?: number | string;
  } & React.RefAttributes<SVGSVGElement>
>;

// Key metric component
const KeyMetric = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-start p-4 transition-colors rounded-lg bg-secondary/20 hover:bg-secondary/40 w-full sm:w-auto">
    <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-primary/20 shrink-0">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-bold text-foreground sm:text-lg">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

// Info card
const InfoCard = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card className="h-full border-none shadow-none bg-transparent w-full">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl flex-wrap">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="break-words">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Empty placeholder
const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-40 text-center rounded-lg bg-secondary/30 p-4">
    <Info className="w-8 h-8 mb-2 text-muted-foreground" />
    <p className="italic text-muted-foreground">{message}</p>
  </div>
);

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
        url?: string;
      }>;
    };
    financialData?: {
      revenue?: string;
      employees?: string;
      marketCap?: string;
      stockSymbol?: string;
    };
    competitors?: Array<{ name?: string; description?: string }>;
    sourceLinks?: Array<{ title?: string; url?: string }>;
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
  const summaryText = report.summary || "No summary available for this report.";
  const createdAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : "Unknown date";

  const keyMetrics = [
    { label: "Revenue", value: financials.revenue, icon: DollarSign },
    { label: "Market Cap", value: financials.marketCap, icon: TrendingUp },
    { label: "Employees", value: financials.employees, icon: Users },
    { label: "Stock Symbol", value: financials.stockSymbol, icon: Briefcase },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in px-2 sm:px-4">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl glass-card glow-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold font-display glow-text">
              {report.companyName || "Unknown Company"}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Report Generated: {createdAt}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-base shrink-0">
            AI Generated
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {keyMetrics.map((metric) => (
          <KeyMetric key={metric.label} {...metric} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full mb-4 flex gap-2 overflow-x-auto sm:justify-center px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger value="summary" className="shrink-0 snap-start">
            Summary
          </TabsTrigger>
          <TabsTrigger value="company" className="shrink-0 snap-start">
            Company Info
          </TabsTrigger>
          <TabsTrigger value="news" className="shrink-0 snap-start">
            News
          </TabsTrigger>
          <TabsTrigger value="competitors" className="shrink-0 snap-start">
            Competitors
          </TabsTrigger>
          <TabsTrigger value="sources" className="shrink-0 snap-start">
            Sources
          </TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary">
          <InfoCard
            icon={FileText}
            title="Executive Summary"
            description="AI-generated comprehensive analysis"
          >
            <div className="p-4 rounded-lg bg-background">
              <article className="prose prose-sm sm:prose md:prose-md lg:prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summaryText}
                </ReactMarkdown>
              </article>
            </div>
          </InfoCard>
        </TabsContent>

        {/* Company Info */}
        <TabsContent value="company">
          <InfoCard
            icon={Building}
            title="Company Information"
            description={website.domain || "Core details about the company."}
          >
            <div className="space-y-4">
              <p className="text-foreground">
                {website.description || "No description available."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Founded</span>
                  <p className="font-semibold">
                    {website.foundedYear || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Industry
                  </span>
                  <p className="font-semibold">{website.industry || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Headquarters
                  </span>
                  <p className="font-semibold">
                    {website.headquarters || "N/A"}
                  </p>
                </div>
              </div>
              {website.keyPeople && website.keyPeople.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Key People
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {website.keyPeople.map((person, i) => (
                      <Badge key={i} variant="secondary">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        </TabsContent>

        {/* News */}
        <TabsContent value="news">
          <InfoCard
            icon={Newspaper}
            title="Recent News"
            description="Latest updates and articles from various sources."
          >
            {news.length > 0 ? (
              <div className="flex flex-col gap-4">
                {news.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors w-full sm:w-auto"
                  >
                    <h4 className="font-semibold text-foreground">
                      {article.title || "Untitled"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{article.source || "Unknown source"}</span>
                      {article.date && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {article.summary || "No summary available."}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyPlaceholder message="No news articles found." />
            )}
          </InfoCard>
        </TabsContent>

        {/* Competitors */}
        <TabsContent value="competitors">
          <InfoCard
            icon={Users}
            title="Competitors"
            description="Rival companies in the same market."
          >
            {competitors.length > 0 ? (
              <ul className="space-y-3">
                {competitors.map((comp, i) => (
                  <li
                    key={i}
                    className="p-3 border-b border-border/50 break-words"
                  >
                    <p className="font-semibold text-foreground">
                      {comp.name || "Unnamed competitor"}
                    </p>
                    {comp.description && (
                      <p className="text-sm text-muted-foreground">
                        {comp.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyPlaceholder message="No competitors identified." />
            )}
          </InfoCard>
        </TabsContent>

        {/* Sources */}
        <TabsContent value="sources">
          <InfoCard
            icon={LinkIcon}
            title="Sources & References"
            description="Information sources used by the AI for this report."
          >
            {sources.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-foreground break-words">
                {sources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {src.title || src.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyPlaceholder message="No sources listed." />
            )}
          </InfoCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportCard;
