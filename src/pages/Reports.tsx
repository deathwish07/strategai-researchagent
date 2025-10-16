// @ts-nocheck
import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Trash2, Eye, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// A more detailed interface for the Report object
interface Report {
  id: string;
  company_name: string;
  created_at: string;
  summary?: string;
  financial_data?: Record<string, string | number>;
  // FIX: Updated types to allow for arrays of objects
  competitors?: (string | { name: string; [key: string]: any })[];
  website_data?: Record<string, any>;
  news_data?: { title: string; link: string; snippet: string }[];
  source_links?: (string | { url: string; title?: string })[];
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading reports",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportToDelete.id);
      if (error) throw error;

      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      toast({
        title: "Report Deleted",
        description: `The report for ${reportToDelete.company_name} has been removed.`,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting report",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setReportToDelete(null);
    }
  };

  const renderEmptyState = () => (
    <Card className="glass-card border-border">
      <CardContent className="py-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">No Reports Yet</h3>
        <p className="mb-6 text-muted-foreground">
          Generate your first research report to see it here.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-accent"
        >
          Create New Report
        </Button>
      </CardContent>
    </Card>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 rounded-full border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold font-display glow-text">
            Saved Reports
          </h1>
          <p className="text-muted-foreground">
            View and manage your AI-generated research reports.
          </p>
        </div>

        {loading ? (
          renderLoadingState()
        ) : reports.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="flex flex-col glass-card border-border hover-lift"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-display">
                      {report.company_name}
                    </CardTitle>
                    <Badge variant="outline">AI Generated</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="flex-grow text-sm text-muted-foreground line-clamp-3">
                    {report.summary?.substring(0, 150) ??
                      "No summary available."}
                    {report.summary && report.summary.length > 150 && "..."}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setReportToDelete(report)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}
      >
        <DialogContent className="max-w-3xl h-[90vh] sm:h-auto max-h-[90vh] flex flex-col glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              {selectedReport?.company_name}
            </DialogTitle>
            <DialogDescription>
              AI-generated report from{" "}
              {selectedReport &&
                new Date(selectedReport.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow pr-6 -mr-6 overflow-y-auto">
            <ReportDetailsAccordion report={selectedReport} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!reportToDelete}
        onOpenChange={(isOpen) => !isOpen && setReportToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the report for{" "}
              <strong>{reportToDelete?.company_name}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReport}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Helper component for rendering the accordion in the modal
const ReportDetailsAccordion = ({ report }: { report: Report | null }) => {
  if (!report) return null;

  // Function to render object data as a list
  const renderObjectData = (data: Record<string, any>) => (
    <ul className="space-y-2 text-sm">
      {Object.entries(data).map(([key, value]) => (
        <li
          key={key}
          className="flex flex-col pb-2 border-b sm:flex-row border-border/50"
        >
          <strong className="w-48 capitalize">{key.replace(/_/g, " ")}:</strong>
          <span>{String(value)}</span>
        </li>
      ))}
    </ul>
  );

  const defaultOpenItems = Object.keys(report).filter(
    (key) =>
      report[key] &&
      key !== "id" &&
      key !== "created_at" &&
      key !== "company_name"
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenItems}
      className="w-full"
    >
      {report.summary && (
        <ReportSection title="Summary" value="summary">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {report.summary}
          </p>
        </ReportSection>
      )}

      {report.financial_data &&
        Object.keys(report.financial_data).length > 0 && (
          <ReportSection title="Financial Data" value="financial_data">
            {renderObjectData(report.financial_data)}
          </ReportSection>
        )}

      {report.competitors && report.competitors.length > 0 && (
        <ReportSection title="Competitors" value="competitors">
          <div className="flex flex-wrap gap-2">
            {/* FIX: Handle both strings and objects for competitors */}
            {report.competitors.map((comp, i) => {
              const competitorName =
                typeof comp === "string" ? comp : comp?.name;
              if (!competitorName) return null;
              return (
                <Badge key={i} variant="secondary">
                  {competitorName}
                </Badge>
              );
            })}
          </div>
        </ReportSection>
      )}

      {report.website_data && Object.keys(report.website_data).length > 0 && (
        <ReportSection title="Website Info" value="website_data">
          {renderObjectData(report.website_data)}
        </ReportSection>
      )}

      {report.news_data && report.news_data.length > 0 && (
        <ReportSection title="Recent News" value="news_data">
          <div className="space-y-4">
            {report.news_data.map((item, i) => (
              <div key={i} className="p-3 border rounded-md bg-muted/50">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {item.title}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.snippet}
                </p>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {report.source_links && report.source_links.length > 0 && (
        <ReportSection title="Sources" value="source_links">
          <ul className="space-y-2 text-sm list-disc list-inside">
            {/* FIX: Handle both strings and objects for source links */}
            {report.source_links.map((link, i) => {
              if (typeof link === "string") {
                return (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                );
              }
              if (typeof link === "object" && link?.url) {
                return (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {link.title || link.url}
                    </a>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </ReportSection>
      )}
    </Accordion>
  );
};

// Helper component for each accordion item
const ReportSection = ({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) => (
  <AccordionItem value={value}>
    <AccordionTrigger className="text-lg font-semibold">
      {title}
    </AccordionTrigger>
    <AccordionContent>{children}</AccordionContent>
  </AccordionItem>
);

export default Reports;
