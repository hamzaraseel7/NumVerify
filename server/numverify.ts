interface NumVerifyResponse {
  valid: boolean;
  number: string;
  local_format?: string;
  international_format?: string;
  country_prefix?: string;
  country_code?: string;
  country_name?: string;
  location?: string;
  carrier?: string;
  line_type?: string;
}

interface SearchCache {
  [key: string]: {
    data: NumVerifyResponse;
    timestamp: number;
  };
}

const CACHE_DURATION = 1000 * 60 * 60;
const cache: SearchCache = {};

const NUMVERIFY_API_KEY = process.env.NUMVERIFY_API_KEY || "7998f827115757753cccb6bf7188a057";

export async function validatePhoneNumber(phoneNumber: string, countryCode: string): Promise<NumVerifyResponse> {
  const cacheKey = `${countryCode}-${phoneNumber}`;
  
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log("Returning cached result for:", cacheKey);
    return cache[cacheKey].data;
  }

  try {
    const url = `http://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${phoneNumber}&country_code=${countryCode}&format=1`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("NumVerify API error:", data);
      return {
        valid: false,
        number: phoneNumber,
        country_code: countryCode,
      };
    }

    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error("Error calling NumVerify API:", error);
    return {
      valid: false,
      number: phoneNumber,
      country_code: countryCode,
    };
  }
}

export function generateAIInsight(validationResult: NumVerifyResponse): string {
  if (!validationResult.valid) {
    return "This phone number appears to be invalid or not in service. It may be a typo or a disconnected number.";
  }

  const insights: string[] = [];

  if (validationResult.line_type === "mobile") {
    insights.push("This is a mobile number");
  } else if (validationResult.line_type === "landline") {
    insights.push("This is a landline number");
  }

  if (validationResult.carrier) {
    insights.push(`registered with ${validationResult.carrier}`);
  }

  if (validationResult.location) {
    insights.push(`located in ${validationResult.location}`);
  }

  if (validationResult.country_name) {
    insights.push(`from ${validationResult.country_name}`);
  }

  const insight = insights.length > 0 
    ? `${insights.join(", ")}.`
    : "This appears to be a valid phone number.";

  return `${insight} Based on the validation, this number is legitimate and properly formatted for its region.`;
}
