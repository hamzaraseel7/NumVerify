import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching phone number:", phoneNumber, "with country:", countryCode);
    
    setIsSearching(true);
    
    setTimeout(() => {
      setSearchResult({
        phoneNumber: phoneNumber,
        valid: true,
        country: countryCode === "US" ? "United States" : countryCode === "GB" ? "United Kingdom" : "India",
        location: countryCode === "US" ? "California" : countryCode === "GB" ? "London" : "Mumbai",
        carrier: "T-Mobile",
        lineType: "Mobile",
        aiInsight: "This appears to be a legitimate mobile number registered in a metropolitan area. The carrier has a good reputation with low spam reports.",
      });
      setIsSearching(false);
      toast({
        title: "Search complete!",
        description: "Phone number verified successfully.",
      });
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-semibold tracking-tight">Phone Number Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Validate and analyze phone numbers with AI-powered insights
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Search Phone Number</CardTitle>
            <CardDescription>Enter a phone number and country code to verify</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger id="country" data-testid="select-country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States (+1)</SelectItem>
                      <SelectItem value="GB">United Kingdom (+44)</SelectItem>
                      <SelectItem value="IN">India (+91)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSearching} data-testid="button-search">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-searches">247</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-recent-searches">18</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid Numbers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-valid-numbers">94%</div>
            <p className="text-xs text-muted-foreground mt-1">Validation rate</p>
          </CardContent>
        </Card>
      </motion.div>

      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">{searchResult.phoneNumber}</CardTitle>
              <CardDescription>
                {searchResult.valid ? "✓ Valid Number" : "✗ Invalid Number"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Country</p>
                  <p className="text-base mt-1" data-testid="text-result-country">{searchResult.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base mt-1" data-testid="text-result-location">{searchResult.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carrier</p>
                  <p className="text-base mt-1" data-testid="text-result-carrier">{searchResult.carrier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Line Type</p>
                  <p className="text-base mt-1" data-testid="text-result-line-type">{searchResult.lineType}</p>
                </div>
              </div>

              <div className="p-4 rounded-md bg-accent border-l-4 border-primary">
                <p className="text-sm font-medium mb-2">AI Insight</p>
                <p className="text-sm text-muted-foreground" data-testid="text-ai-insight">
                  {searchResult.aiInsight}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
