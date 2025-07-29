import React from "react";

function Contact() {
  return (
    <div className="bg-[#e6f2ec] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2e7d32] mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8">
          We’re here to support you in making communication more inclusive.
          Whether you have questions, suggestions, or wish to collaborate,
          please reach out. Let’s work together to bridge the gap between the
          Deaf and hearing communities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded shadow p-8 border border-[#86ba98]">
        <h2 className="text-2xl font-bold text-[#2e7d32] mb-6">
          Get in Touch
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Organization:</span>{" "}
            Aisha Saleem Welfare Trust AJK
          </p>
          <p>
            <span className="font-semibold">Email (Support):</span>{" "}
            <a
              href="mailto:support@hhslt.org"
              className="text-[#2e7d32] hover:underline"
            >
              aishasaleemwelfaretrust@gmail.com
            </a>
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +44 7470 520952
          </p>
          <p>
            <span className="font-semibold">Address:</span> Dist.Bhimber, Teh.Samahni Azad Kashmir
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center mt-12">
        <h3 className="text-xl font-semibold text-[#2e7d32] mb-2">
          We're Listening
        </h3>
        <p className="text-gray-700">
          Your feedback helps us improve our platform and better serve the community. 
          Reach out and let us know how we can make sign language technology even more impactful.
        </p>
      </div>
    </div>
  );
}

export default Contact;
