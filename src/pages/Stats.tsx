import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StatsData {
  totalProposals: number;
  repliedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

const Stats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProposals: 0,
    repliedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [proposalsData, repliedData, pendingData, rejectedData] = await Promise.all([
        supabase.from("proposals").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("clients").select("*", { count: "exact" }).eq("user_id", user.id).eq("status", "replied"),
        supabase.from("clients").select("*", { count: "exact" }).eq("user_id", user.id).eq("status", "pending"),
        supabase.from("clients").select("*", { count: "exact" }).eq("user_id", user.id).eq("status", "rejected"),
      ]);

      setStats({
        totalProposals: proposalsData.count || 0,
        repliedCount: repliedData.count || 0,
        pendingCount: pendingData.count || 0,
        rejectedCount: rejectedData.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const barChartData = [
    { name: "Total Proposals", value: stats.totalProposals },
    { name: "Replied", value: stats.repliedCount },
    { name: "Pending", value: stats.pendingCount },
    { name: "Rejected", value: stats.rejectedCount },
  ];

  const pieChartData = [
    { name: "Replied", value: stats.repliedCount },
    { name: "Pending", value: stats.pendingCount },
    { name: "Rejected", value: stats.rejectedCount },
  ];

  const COLORS = ["hsl(142, 76%, 36%)", "hsl(48, 96%, 53%)", "hsl(0, 84%, 60%)"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-muted-foreground">View your performance metrics and analytics</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proposal Overview</CardTitle>
            <CardDescription>Total proposals and client responses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Status Distribution</CardTitle>
            <CardDescription>Breakdown of client responses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">Replied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.repliedCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Positive responses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-600 dark:text-yellow-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.pendingCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.rejectedCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Declined proposals</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
