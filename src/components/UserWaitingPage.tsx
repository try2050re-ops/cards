import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Moon, Sun, Loader2, Sparkles, Zap, Globe } from "lucide-react";
import { useTheme } from "next-themes";

export const UserWaitingPage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppContact = () => {
    const phoneNumber = "201559181558";
    const message = "مرحباً، أريد الاستفسار عن نظام إدارة خطوط الإنترنت";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
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
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8 max-w-2xl">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
              <Globe className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Zap className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-fade-in">
              نظام إدارة خطوط الإنترنت
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              مرحباً بك في المستقبل الرقمي
            </p>
          </div>

          {/* Status Card */}
          <Card className="shadow-2xl animate-scale-in border-2 border-gradient-to-r from-blue-200 to-green-200" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                حالة النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  🚧 النظام قيد التطوير 🚧
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    نعمل بجد لإنهاء الموقع وتقديم أفضل تجربة لك
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span>جاري العمل</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            animationStep === i 
                              ? 'bg-blue-600 scale-125' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">نظام المصادقة</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">مكتمل ✅</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">إدارة البيانات</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">قيد التطوير 🔄</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">التقارير</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">قريباً 📊</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">الإشعارات</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">قريباً 🔔</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={handleWhatsAppContact}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover-scale transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5 ml-2" />
              تواصل مع المطور عبر واتساب
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              للاستفسارات والدعم الفني
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p>© 2025 نظام إدارة خطوط الإنترنت - جميع الحقوق محفوظة</p>
            <p className="mt-1">تم التطوير بواسطة فريق التطوير المتخصص</p>
          </div>
        </div>
      </div>
    </div>
  );
};