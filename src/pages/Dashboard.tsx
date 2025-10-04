import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalProposals: number;
  totalClients: number;
  pendingClients: number;
  recentProposals: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProposals: 0,
    totalClients: 0,
    pendingClients: 0,
    recentProposals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [proposalsData, clientsData, pendingData, recentData] = await Promise.all([
        supabase.from("proposals").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("clients").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("clients").select("*", { count: "exact" }).eq("user_id", user.id).eq("status", "pending"),
        supabase
          .from("proposals")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalProposals: proposalsData.count || 0,
        totalClients: clientsData.count || 0,
        pendingClients: pendingData.count || 0,
        recentProposals: recentData.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Proposals",
      value: stats.totalProposals,
      icon: FileText,
      description: "All generated proposals",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      description: "Active clients",
    },
    {
      title: "Pending Clients",
      value: stats.pendingClients,
      icon: Clock,
      description: "Awaiting response",
    },
    {
      title: "This Week",
      value: stats.recentProposals,
      icon: TrendingUp,
      description: "Proposals generated",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your freelance workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/generate"
              className="p-6 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300 group"
            >
              <FileText className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Generate Proposal</h3>
              <p className="text-sm text-muted-foreground">Create AI-powered proposals for your clients</p>
            </a>
            <a
              href="/clients"
              className="p-6 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300 group"
            >
              <Users className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Manage Clients</h3>
              <p className="text-sm text-muted-foreground">Track and organize your client relationships</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
