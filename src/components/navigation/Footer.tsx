
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t py-8 dark:bg-gray-900">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-primary">SpeakerBook</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Connect with experts and book engaging sessions
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Platform</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/speakers"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Speakers
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SpeakerBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
