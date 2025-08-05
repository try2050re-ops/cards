import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { CustomerTable } from "@/components/CustomerTable";
import { CustomerForm } from "@/components/CustomerForm";
import { Lines20Table } from "@/components/Lines20Table";
import { Lines60Table } from "@/components/Lines60Table";
import { LineForm } from "@/components/LineForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Plus, Wifi, Router, LogOut, Moon, Sun, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Customer {
  id: number;
  customer_name: string;
  mobile_number: string;
  line_type: string;
  charging_date: string | null;
  payment_status: string;
  monthly_price: number | null;
  renewal_status: string;
  created_at: string;
  updated_at: string;
}

interface Line {
  id: number;
  customer_name: string;
  mobile_number: string;
  line_type: string;
  charging_date: string | null;
  payment_status: string;
  monthly_price: number | null;
  renewal_status: string;
  renewal_date: string | null;
  days_until_renewal: number | null;
  is_renewal_due: boolean | null;
  created_at: string;
  updated_at: string;
}

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showLineForm, setShowLineForm] = useState(false);
  const [editingLine, setEditingLine] = useState<Line | null>(null);
  const [currentLineType, setCurrentLineType] = useState<'20' | '60'>('20');
  const { theme, setTheme } = useTheme();

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
    setActiveTab("customers");
  };

  const handleAddLine20 = () => {
    setEditingLine(null);
    setCurrentLineType('20');
    setShowLineForm(true);
    setActiveTab("lines20");
  };

  const handleAddLine60 = () => {
    setEditingLine(null);
    setCurrentLineType('60');
    setShowLineForm(true);
    setActiveTab("lines60");
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleEditLine = (line: Line) => {
    setEditingLine(line);
    setCurrentLineType(line.line_type as '20' | '60');
    setShowLineForm(true);
  };

  const handleSaveCustomer = () => {
    setShowForm(false);
    setEditingCustomer(null);
    // Refresh data will happen automatically via component re-renders
  };

  const handleSaveLine = () => {
    setShowLineForm(false);
    setEditingLine(null);
    // Refresh data will happen automatically via component re-renders
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCancelLineForm = () => {
    setShowLineForm(false);
    setEditingLine(null);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "201559181558";
    const message = "مرحباً، أريد الاستفسار عن نظام إدارة خطوط الإنترنت";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover-scale"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsAppContact}
              className="hover-scale bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40"
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              تواصل مع المطور
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="hover-scale text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>

        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            نظام إدارة خطوط الإنترنت
          </h1>
          <p className="text-xl text-muted-foreground">
            إدارة عملاء خطوط الإنترنت والاشتراكات الشهرية بكل سهولة
          </p>
        </header>
        
        {!showForm && !showLineForm ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 animate-scale-in">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  لوحة التحكم
                </TabsTrigger>
                <TabsTrigger value="lines20" className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  خطوط 20
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  خطوط 40
                </TabsTrigger>
                <TabsTrigger value="lines60" className="flex items-center gap-2">
                  <Router className="h-4 w-4" />
                  خطوط 60
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-8">
              <Dashboard />
            </TabsContent>


            <TabsContent value="lines20" className="mt-8">
              <Lines20Table 
                onAddLine={handleAddLine20}
                onEditLine={handleEditLine}
              />
            </TabsContent>

            <TabsContent value="customers" className="mt-8">
              <CustomerTable 
                onAddCustomer={handleAddCustomer}
                onEditCustomer={handleEditCustomer}
              />
            </TabsContent>

            <TabsContent value="lines60" className="mt-8">
              <Lines60Table 
                onAddLine={handleAddLine60}
                onEditLine={handleEditLine}
              />
            </TabsContent>
          </Tabs>
        ) : showForm ? (
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSaveCustomer}
            onCancel={handleCancelForm}
          />
        ) : (
          <LineForm
            line={editingLine}
            lineType={currentLineType}
            onSave={handleSaveLine}
            onCancel={handleCancelLineForm}
          />
        )}

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <Button
            onClick={handleAddCustomer}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover-scale animate-pulse"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
