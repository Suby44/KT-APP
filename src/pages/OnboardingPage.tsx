import { useNavigate } from "react-router-dom";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { useAppData } from "../context/AppDataContext";

export function OnboardingPage() {
  const { saveSettings } = useAppData();
  const navigate = useNavigate();

  return (
    <OnboardingFlow
      onComplete={(settings) => {
        saveSettings(settings);
        navigate("/", { replace: true });
      }}
    />
  );
}
