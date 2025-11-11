import { countries } from "@/data/countries";

<Select value={countryCode} onValueChange={setCountryCode}>
  <SelectTrigger id="country" data-testid="select-country">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {countries.map((country) => (
      <SelectItem key={country.code} value={country.code}>
        {country.name} ({country.dialCode})
      </SelectItem>
    ))}
  </SelectContent>
</Select>