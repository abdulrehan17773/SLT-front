import React from "react";

function Contact() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8">
          We’re here to support you in making communication more inclusive.
          Whether you have questions, suggestions, or wish to collaborate,
          please reach out. Let’s work together to bridge the gap between the
          Deaf and hearing communities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded shadow p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Get in Touch
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Email (Support):</span>{" "}
            <a
              href="mailto:support@signtranslator.com"
              className="text-blue-700 hover:underline"
            >
              support@signtranslator.com
            </a>
          </p>
          <p>
            <span className="font-semibold">Email (Partnerships):</span>{" "}
            <a
              href="mailto:partners@signtranslator.com"
              className="text-blue-700 hover:underline"
            >
              partners@signtranslator.com
            </a>
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +1 (555) 123-4567
          </p>
          <p>
            <span className="font-semibold">Address:</span> 123 Sign Street,
            Communication City, USA
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
