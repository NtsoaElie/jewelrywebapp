import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";

export function NotFound({ homeHref = "/", homeLabel = "Back to Home" }: { homeHref?: string; homeLabel?: string }) {
  return (
    <div className="container py-20">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        action={
          <Link to={homeHref} className={buttonClasses("primary", "md")}>
            {homeLabel}
          </Link>
        }
      />
    </div>
  );
}
