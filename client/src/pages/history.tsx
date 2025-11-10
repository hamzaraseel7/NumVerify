import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface SearchHistory {
  id: string;
  phoneNumber: string;
  countryCode: string;
  country: string | null;
  carrier: string | null;
  valid: boolean;
  createdAt: string;
}

export default function SearchHistory() {
  const { data: searches, isLoading } = useQuery<SearchHistory[]>({
    queryKey: ["/api/searches"],
  });

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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading searches...</p>
        </div>
      ) : !searches || searches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No searches yet. Start by searching a phone number!</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {searches.map((item, index) => (
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
                        <span data-testid={`text-country-${item.id}`}>
                          {item.country || item.countryCode}
                        </span>
                        {item.carrier && (
                          <>
                            <span>•</span>
                            <span data-testid={`text-carrier-${item.id}`}>{item.carrier}</span>
                          </>
                        )}
                        <span>•</span>
                        <span data-testid={`text-timestamp-${item.id}`}>
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
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
      )}
    </div>
  );
}
