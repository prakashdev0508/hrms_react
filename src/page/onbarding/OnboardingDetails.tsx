import { useParams } from "react-router-dom";
import OnboardingDetailsForm from "../../components/forms/OnboardingDetailsForm";

const OnboardingDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <OnboardingDetailsForm pricingId={id} />
    </div>
  );
};

export default OnboardingDetails;
