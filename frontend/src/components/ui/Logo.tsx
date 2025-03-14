import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  href?: string;
  className?: string;
  variant?: "text" | "image" | "horizontal";
}

const Logo: React.FC<LogoProps> = ({
  size = "medium",
  href = undefined,
  className = "",
  variant = "text",
}) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-16",
  };

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  // Function to get the correct path with base URL if needed
  const getImagePath = (path: string) => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    return `${base}/assets/images/${path}`;
  };

  // Choose logo content based on variant
  const logoContent = (() => {
    if (variant === "text") {
      return (
        <div className={`font-bold ${textSizeClasses[size]} ${className}`}>
          <span className="text-primary-600">Arch</span>
          <span className="text-primary-800">Spec</span>
        </div>
      );
    } else if (variant === "horizontal") {
      return (
        <img
          src={getImagePath("arch-spec-logo-horizontal.png")}
          alt="ArchSpec"
          className={`${sizeClasses[size]} ${className}`}
        />
      );
    } else {
      return (
        <img
          src={getImagePath("arch-spec-logo.png")}
          alt="ArchSpec"
          className={`${sizeClasses[size]} ${className}`}
        />
      );
    }
  })();

  return href ? (
    <Link to={href} className="flex items-center">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
};

export default Logo;
