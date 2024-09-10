import OrganizationForm from "../../components/forms/OrganizationForm";
import { useParams } from "react-router-dom";

const OrganisationDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <OrganizationForm pricingId={id} />
    </div>
  );
};

export default OrganisationDetails;
