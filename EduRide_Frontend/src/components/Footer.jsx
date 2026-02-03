// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="mt-12 py-6 bg-gray-50 border-t">
      <p className="text-center text-gray-500 text-sm font-medium">
        © 2026 EduRide – Smart School Transportation Portal
      </p>

      <p className="text-center text-gray-500 text-sm font-medium">
        All rights reserved. Unauthorized use is prohibited.
      </p>

      <p className="text-center text-gray-500 text-sm font-medium">
        <a
          href="/EduRide_Terms_Privacy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 hover:underline"
        >
          Terms of Use | Privacy Policy
        </a>
      </p>
    </footer>
  );
}

export default Footer;
