import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Users, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const features = [
    {
      icon: FileText,
      title: "AI-Powered Proposals",
      description: "Generate professional proposals tailored to each job description with customizable tones",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Track and organize all your clients across different platforms in one place",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Visualize your success rate with detailed statistics and insights",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Freelance Flow
            </span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="gradient">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Win More Clients with AI-Powered Proposals
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your freelance workflow with intelligent proposal generation, client tracking, and performance analytics
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} variant="gradient" className="shadow-elegant">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 border border-border hover:shadow-elegant transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl p-12 text-center text-white max-w-4xl mx-auto shadow-glow">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Freelance Business?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of freelancers who are winning more projects with Freelance Flow
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Freelance Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
