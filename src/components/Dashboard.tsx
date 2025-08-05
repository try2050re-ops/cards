import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  total20Lines: number;
  total40Lines: number;
  total60Lines: number;
  paidCustomers: number;
  renewedCustomers: number;
  totalRevenue: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    total20Lines: 0,
    total40Lines: 0,
    total60Lines: 0,
    paidCustomers: 0,
    renewedCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscriptions for automatic updates
    const customersSubscription = supabase
      .channel('customers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        fetchStats();
      })
      .subscribe();

    const lines20Subscription = supabase
      .channel('lines20-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lines_20' }, () => {
        fetchStats();
      })
      .subscribe();

    const lines60Subscription = supabase
      .channel('lines60-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lines_60' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(customersSubscription);
      supabase.removeChannel(lines20Subscription);
      supabase.removeChannel(lines60Subscription);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch customers (40 lines)
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('payment_status, renewal_status, monthly_price');

      if (customersError) throw customersError;

      // Fetch 20 lines
      const { data: lines20, error: lines20Error } = await supabase
        .from('lines_20')
        .select('payment_status, renewal_status, monthly_price');

      if (lines20Error) throw lines20Error;

      // Fetch 60 lines
      const { data: lines60, error: lines60Error } = await supabase
        .from('lines_60')
        .select('payment_status, renewal_status, monthly_price');

      if (lines60Error) throw lines60Error;

      // Calculate stats
      const total40Lines = customers?.length || 0;
      const total20Lines = lines20?.length || 0;
      const total60Lines = lines60?.length || 0;
      const totalCustomers = total20Lines + total40Lines + total60Lines;

      // Combine all data for calculations
      const allData = [
        ...(customers || []),
        ...(lines20 || []),
        ...(lines60 || [])
      ];

      const paidCustomers = allData.filter(c => c.payment_status === 'دفع').length;
      const renewedCustomers = allData.filter(c => c.renewal_status === 'تم').length;
      const totalRevenue = allData.reduce((sum, c) => sum + (c.monthly_price || 0), 0);

      setStats({
        totalCustomers,
        total20Lines,
        total40Lines,
        total60Lines,
        paidCustomers,
        renewedCustomers,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, className = "" }: {
    title: string;
    value: string | number;
    icon: any;
    className?: string;
  }) => (
    <Card className={`hover-scale transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">لوحة التحكم</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الخطوط"
          value={stats.totalCustomers}
          icon={Users}
          className="animate-fade-in"
        />
        <StatCard
          title="خطوط 20 ميجا"
          value={stats.total20Lines}
          icon={Users}
          className="animate-fade-in border-blue-200 bg-blue-50"
        />
        <StatCard
          title="خطوط 40 ميجا"
          value={stats.total40Lines}
          icon={Users}
          className="animate-fade-in border-orange-200 bg-orange-50"
        />
        <StatCard
          title="خطوط 60 ميجا"
          value={stats.total60Lines}
          icon={Users}
          className="animate-fade-in border-purple-200 bg-purple-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <StatCard
          title="الخطوط المدفوعة"
          value={stats.paidCustomers}
          icon={CheckCircle}
          className="animate-fade-in border-green-200 bg-green-50"
        />
        <StatCard
          title="التجديدات المكتملة"
          value={stats.renewedCustomers}
          icon={AlertCircle}
          className="animate-fade-in border-indigo-200 bg-indigo-50"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} جنيه`}
          icon={DollarSign}
          className="animate-fade-in border-yellow-200 bg-yellow-50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              معدل الدفع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalCustomers > 0 
                ? Math.round((stats.paidCustomers / stats.totalCustomers) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.paidCustomers} من {stats.totalCustomers} خط مدفوع
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              معدل التجديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalCustomers > 0 
                ? Math.round((stats.renewedCustomers / stats.totalCustomers) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.renewedCustomers} من {stats.totalCustomers} خط مجدد
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};