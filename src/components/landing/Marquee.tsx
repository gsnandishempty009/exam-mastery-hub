import { AlertCircle, Zap, Lock, CheckCircle } from "lucide-react";

const Marquee = () => {
  const announcements = [
    { icon: Zap, text: "✨ New Feature: PDF Upload Support - Upload study materials directly!", color: "text-yellow-500" },
    { icon: CheckCircle, text: "✅ Enhanced Contact Form - Include subject details for faster support", color: "text-green-500" },
    { icon: Lock, text: "🔒 Your Data is Secure - All data encrypted with enterprise-grade security", color: "text-blue-500" },
    { icon: AlertCircle, text: "⚠️ Important: Always verify your credentials before sharing", color: "text-red-500" },
    { icon: CheckCircle, text: "✨ Semester & Year Tracking - Better organization of your academic progress", color: "text-green-500" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border">
      <div className="overflow-hidden">
        <div className="flex animate-marquee space-x-8 py-3 px-4">
          {announcements.map((announcement, index) => {
            const Icon = announcement.icon;
            return (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                <Icon className={`w-4 h-4 ${announcement.color}`} />
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  {announcement.text}
                </span>
              </div>
            );
          })}
          {/* Duplicate for seamless loop */}
          {announcements.map((announcement, index) => {
            const Icon = announcement.icon;
            return (
              <div key={`dup-${index}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                <Icon className={`w-4 h-4 ${announcement.color}`} />
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  {announcement.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
