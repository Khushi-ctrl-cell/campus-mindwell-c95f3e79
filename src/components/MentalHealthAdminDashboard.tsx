import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Star
} from "lucide-react";

interface AnalyticsData {
  month: string;
  total_sessions: number;
  avg_satisfaction: number;
  escalated_sessions: number;
}

interface AppointmentData {
  month: string;
  purpose: string;
  total_appointments: number;
  completed_appointments: number;
}

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentalHealthAdminDashboard = ({ isOpen, onClose }: DashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch chat analytics
      const { data: chatData, error: chatError } = await supabase
        .from('admin_analytics')
        .select('*')
        .limit(12);

      if (chatError) throw chatError;

      // Fetch appointment analytics  
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointment_analytics')
        .select('*')
        .limit(12);

      if (appointmentError) throw appointmentError;

      setAnalytics(chatData || []);
      setAppointments(appointmentData || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error Loading Data",
        description: "Could not load dashboard analytics.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalSessions = () => {
    return analytics.reduce((total, item) => total + item.total_sessions, 0);
  };

  const getAverageSatisfaction = () => {
    const validRatings = analytics.filter(item => item.avg_satisfaction > 0);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, item) => sum + item.avg_satisfaction, 0) / validRatings.length;
  };

  const getTotalAppointments = () => {
    return appointments.reduce((total, item) => total + item.total_appointments, 0);
  };

  const getCompletionRate = () => {
    const totalAppt = getTotalAppointments();
    const completed = appointments.reduce((total, item) => total + item.completed_appointments, 0);
    return totalAppt > 0 ? (completed / totalAppt) * 100 : 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-glow">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-calm rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Mental Health Analytics Dashboard</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Anonymous Data Only</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-2xl font-bold">{getTotalSessions()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                    <p className="text-2xl font-bold">{getAverageSatisfaction().toFixed(1)}/5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold">{getTotalAppointments()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{getCompletionRate().toFixed(1)}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
                <TabsTrigger value="planning">Policy Planning</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chat Sessions Overview */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Chat Sessions (Last 12 Months)
                    </h4>
                    <div className="space-y-3">
                      {analytics.slice(0, 6).map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                          <Badge variant="outline">{item.total_sessions} sessions</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Appointment Categories */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Popular Support Categories
                    </h4>
                    <div className="space-y-3">
                      {Array.from(new Set(appointments.map(a => a.purpose)))
                        .slice(0, 6)
                        .map((purpose, index) => {
                          const total = appointments
                            .filter(a => a.purpose === purpose)
                            .reduce((sum, a) => sum + a.total_appointments, 0);
                          return (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">{purpose}</span>
                              <Badge variant="outline">{total} appointments</Badge>
                            </div>
                          );
                        })}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage Trends & Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Positive Indicators</span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                        <li>• High satisfaction ratings indicate effective support</li>
                        <li>• Consistent usage shows students trust the platform</li>
                        <li>• Low escalation rate suggests good initial support</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Areas for Attention</span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                        <li>• Monitor peak usage times for resource allocation</li>
                        <li>• Track seasonal patterns in mental health needs</li>
                        <li>• Consider expanding hours during high-demand periods</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="planning" className="space-y-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Campus Wellness Policy Planning
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium">Resource Allocation Priorities</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Maintain 24/7 crisis support availability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Expand counselor hours during exam periods</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Implement peer support training programs</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium">Policy Recommendations</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span>Review mental health accommodation policies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span>Enhance privacy protection measures</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span>Develop proactive intervention protocols</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MentalHealthAdminDashboard;