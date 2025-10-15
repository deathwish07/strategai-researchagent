-- 🧠 Create reports table for AI-generated company research

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 🔍 Core metadata
  company_name TEXT NOT NULL,

  -- 🧩 Structured AI data fields
  website_data JSONB,         -- Website, domain, description, etc.
  news_data JSONB,            -- Latest relevant news
  financial_data JSONB,       -- Revenue, employees, valuation, etc.
  competitors JSONB,          -- List of competitors and their summaries
  source_links JSONB,         -- URLs or references used for generation
  ai_version TEXT DEFAULT 'gpt-5-mini',  -- Model version used for analysis

  -- 🧾 Summary and timestamps
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 🔒 Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON public.reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create own reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports"
  ON public.reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Allow updates (e.g. AI re-run or enrich existing report)
CREATE POLICY "Users can update own reports"
  ON public.reports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 🕒 Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ✅ Indexes for performance
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_company_name ON public.reports(company_name);
