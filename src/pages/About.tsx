import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-bold mb-4 glow-text">
              About Strategai
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered multi-agent research platform by Strategai
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl glow-border mb-8">
            <h2 className="font-display text-2xl font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground mb-4">
              Strategai is an advanced AI-powered application designed to
              revolutionize how you gather and analyze company information.
              Using cutting-edge multi-agent AI technology, we automate the
              entire research process to deliver comprehensive, accurate reports
              in seconds.
            </p>
            <p className="text-muted-foreground">
              Built with React, TypeScript, and powered by OpenAI, Strategai
              combines the latest in web technology with state-of-the-art
              artificial intelligence to provide you with professional-grade
              research capabilities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="glass-card border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  Multi-Agent AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Three specialized AI agents work together: Web Research, News
                  Analysis, and Summary Generation for comprehensive insights.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  Lightning Fast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate detailed research reports in seconds, not hours. Our
                  AI agents process information at incredible speeds.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your research data is stored securely with enterprise-grade
                  encryption. Only you have access to your reports.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  Cloud-Powered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built on scalable cloud infrastructure and reliability for all
                  your research needs.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="font-semibold mb-1">Frontend</p>
                  <p className="text-sm text-muted-foreground">
                    React + TypeScript
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="font-semibold mb-1">Styling</p>
                  <p className="text-sm text-muted-foreground">Tailwind CSS</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="font-semibold mb-1">Backend</p>
                  <p className="text-sm text-muted-foreground">
                    Cloud Platform
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="font-semibold mb-1">AI</p>
                  <p className="text-sm text-muted-foreground">Google Gemini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
