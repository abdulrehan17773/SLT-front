import React from "react";

function About() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-4">
          About Sign Language Translator
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8">
          At Sign Language Translator, our mission is to bridge communication gaps between the Deaf and hearing communities. 
          We leverage cutting-edge technology to translate spoken and written language into sign language, fostering inclusion and accessibility for all.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700">
            We envision a world where language is no barrier. Our platform empowers businesses, educators, healthcare providers, and individuals 
            to communicate seamlessly with members of the Deaf and Hard of Hearing community, ensuring equal access to information and opportunities.
          </p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            What We Do
          </h2>
          <p className="text-gray-700">
            Using advanced machine learning and computer vision, our tools translate text, speech, and video into sign language in real-time. 
            We continuously improve our models to support a growing vocabulary and more natural, expressive signing.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center mt-12">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">
          Join Us on Our Mission
        </h3>
        <p className="text-gray-700 mb-4">
          Whether you’re an advocate, user, partner, or supporter, we invite you to join us in making communication accessible for everyone. 
          Together, we can create a more inclusive world.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-700 text-white font-semibold px-6 py-3 rounded hover:bg-blue-800 transition duration-300 cursor-pointer"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}

export default About;
