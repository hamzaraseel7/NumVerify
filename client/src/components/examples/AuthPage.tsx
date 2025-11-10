import AuthPage from "../../pages/auth";
import { ThemeProvider } from "../theme-provider";

export default function AuthPageExample() {
  return (
    <ThemeProvider>
      <AuthPage />
    </ThemeProvider>
  );
}
