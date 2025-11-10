import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const mockHistory = [
  {
    id: 1,
    phoneNumber: "+1 555 123 4567",
    country: "United States",
    timestamp: "2 hours ago",
    valid: true,
    carrier: "T-Mobile",
  },
  {
    id: 2,
    phoneNumber: "+44 20 7946 0958",
    country: "United Kingdom",
    timestamp: "5 hours ago",
    valid: true,
    carrier: "Vodafone",
  },
  {
    id: 3,
    phoneNumber: "+91 98765 43210",
    country: "India",
    timestamp: "1 day ago",
    valid: true,
    carrier: "Airtel",
  },
  {
    id: 4,
    phoneNumber: "+1 555 000 0000",
    country: "United States",
    timestamp: "2 days ago",
    valid: false,
    carrier: "Unknown",
  },
  {
    id: 5,
    phoneNumber: "+1 555 987 6543",
    country: "United States",
    timestamp: "3 days ago",
    valid: true,
    carrier: "Verizon",
  },
];

export default function SearchHistory() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Search History</h1>
        <p className="text-muted-foreground mt-2">View your previous phone number searches</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        {mockHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover-elevate transition-shadow" data-testid={`card-history-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-lg font-medium" data-testid={`text-phone-${item.id}`}>
                        {item.phoneNumber}
                      </p>
                      <Badge variant={item.valid ? "default" : "destructive"} className="text-xs">
                        {item.valid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span data-testid={`text-country-${item.id}`}>{item.country}</span>
                      <span>•</span>
                      <span data-testid={`text-carrier-${item.id}`}>{item.carrier}</span>
                      <span>•</span>
                      <span data-testid={`text-timestamp-${item.id}`}>{item.timestamp}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("View details for:", item.phoneNumber)}
                    data-testid={`button-view-${item.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
