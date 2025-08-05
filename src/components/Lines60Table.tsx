import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Phone, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Line60 {
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

interface Lines60TableProps {
  onAddLine: () => void;
  onEditLine: (line: Line60) => void;
}

export const Lines60Table = ({ onAddLine, onEditLine }: Lines60TableProps) => {
  const [lines, setLines] = useState<Line60[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const { data, error } = await supabase
        .from('lines_60_with_calculations')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setLines(data || []);
    } catch (error) {
      console.error('Error fetching lines 60:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات خطوط 60 ميجا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLine = async (id: number) => {
    try {
      const { error } = await supabase
        .from('lines_60')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLines(lines.filter(l => l.id !== id));
      toast({
        title: "تم بنجاح",
        description: "تم حذف الخط بنجاح",
      });
    } catch (error) {
      console.error('Error deleting line:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخط",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'دفع') {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">دفع</Badge>;
    }
    return <Badge variant="secondary">لم يدفع</Badge>;
  };

  const getRenewalStatusBadge = (status: string) => {
    if (status === 'تم') {
      return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">تم التجديد</Badge>;
    }
    return <Badge variant="outline">لم يتم</Badge>;
  };

  const getRenewalAlert = (line: Line60) => {
    if (line.is_renewal_due && line.days_until_renewal !== null) {
      if (line.days_until_renewal <= 0) {
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            انتهت الصلاحية
          </Badge>
        );
      } else if (line.days_until_renewal <= 3) {
        return (
          <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {line.days_until_renewal} أيام متبقية
          </Badge>
        );
      }
    }
    return null;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">خطوط 60 ميجا</h2>
        <Button onClick={onAddLine} className="hover-scale">
          <Plus className="h-4 w-4 ml-2" />
          إضافة خط جديد
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right">رقم الخط</TableHead>
              <TableHead className="text-right">اسم العميل</TableHead>
              <TableHead className="text-right">رقم الموبايل</TableHead>
              <TableHead className="text-right">نوع الخط</TableHead>
              <TableHead className="text-right">تاريخ الشحن</TableHead>
              <TableHead className="text-right">معاد التجديد</TableHead>
              <TableHead className="text-right">حالة الدفع</TableHead>
              <TableHead className="text-right">السعر الشهري</TableHead>
              <TableHead className="text-right">حالة التجديد</TableHead>
              <TableHead className="text-right">تنبيه التجديد</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow 
                key={line.id} 
                className="hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TableCell className="font-medium">{line.id}</TableCell>
                <TableCell>{line.customer_name || 'غير محدد'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {line.mobile_number}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-purple-50">{line.line_type} ميجا</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(line.charging_date)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(line.renewal_date)}
                  </div>
                </TableCell>
                <TableCell>{getPaymentStatusBadge(line.payment_status)}</TableCell>
                <TableCell>
                  {line.monthly_price ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {line.monthly_price} جنيه
                    </div>
                  ) : (
                    'غير محدد'
                  )}
                </TableCell>
                <TableCell>{getRenewalStatusBadge(line.renewal_status)}</TableCell>
                <TableCell>{getRenewalAlert(line)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditLine(line)}
                      className="h-8 w-8 hover-scale"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteLine(line.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover-scale"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {lines.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-muted-foreground text-lg">لا توجد خطوط 60 ميجا</div>
          <Button onClick={onAddLine} className="mt-4 hover-scale">
            <Plus className="h-4 w-4 ml-2" />
            إضافة أول خط
          </Button>
        </div>
      )}
    </div>
  );
};