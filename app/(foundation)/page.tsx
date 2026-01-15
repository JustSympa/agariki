import React from 'react';
import { ArrowRight, MapPin, MessageSquare, Shield, TrendingUp, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Agariki" className="h-8 w-8" />
            <span className="text-xl font-bold text-black">Agariki</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/auth/login" className="text-black hover:text-gray-700 font-medium">
              Login
            </a>
            <a
              href="/auth/signup"
              className="bg-[#c6613f] text-white px-6 py-2 rounded-lg hover:bg-[#a85434] font-medium transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#f4e8e4] text-[#c6613f] px-4 py-2 rounded-full text-sm font-medium mb-6">
              Connecting Cameroon's Fungus Sector
            </div>
            <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
              Bridge the Gap Between Supply and Demand
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Agariki is a location intelligence platform that connects fungus producers with consumers through interactive heatmaps and secure communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/auth/signup"
                className="bg-[#c6613f] text-white px-8 py-4 rounded-lg hover:bg-[#a85434] font-medium transition-colors flex items-center justify-center gap-2"
              >
                Start Mapping Demand
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Learn How It Works
              </a>
            </div>
          </div>
          <div className="relative">
            <img src="/hero-illustration.svg" alt="Agariki Platform" className="w-full" />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">The Challenge We're Solving</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cameroon's fungus sector has a critical information problem: demand exceeds supply, but producers and consumers can't find each other.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#f4e8e4] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#c6613f]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Producers Lost in the Dark</h3>
              <p className="text-gray-600">
                No visibility into demand hotspots leads to inefficient distribution, missed opportunities, and poor capacity planning.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#f4e8e4] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#c6613f]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Consumers Searching Blindly</h3>
              <p className="text-gray-600">
                Difficulty locating reliable suppliers results in inconsistent supply, wasted time, and limited sourcing options.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#f4e8e4] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#c6613f]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Security Concerns</h3>
              <p className="text-gray-600">
                Sharing phone numbers and addresses publicly exposes users to fraud, theft, and harassment without vetting mechanisms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">How Agariki Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple yet powerful platform built on three core principles: location intelligence, privacy protection, and secure communication.
            </p>
          </div>

          {/* For Consumers */}
          <div className="mb-20">
            <div className="inline-block bg-[#c6613f] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOR CONSUMERS
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-black mb-6">Discover Producers Near You</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">View Producer Heatmap</h4>
                      <p className="text-gray-600">See where fungus producers are located and their production capacity across regions.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">Create Delivery Points</h4>
                      <p className="text-gray-600">Mark where you need deliveries using nearby public landmarks for privacy.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">Chat Securely</h4>
                      <p className="text-gray-600">Connect with producers through in-app chat, verify legitimacy, then exchange contacts when ready.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <img src="/consumer-flow.svg" alt="Consumer workflow" className="w-full" />
              </div>
            </div>
          </div>

          {/* For Producers */}
          <div>
            <div className="inline-block bg-[#c6613f] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOR PRODUCERS
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 order-2 lg:order-1">
                <img src="/producer-flow.svg" alt="Producer workflow" className="w-full" />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl font-bold text-black mb-6">Visualize Market Demand</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">View Demand Heatmap</h4>
                      <p className="text-gray-600">See consumer demand density across regions to identify high-value market opportunities.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">Mark Production Locations</h4>
                      <p className="text-gray-600">Create Points of Presence showing where you produce and your capacity for fresh and dry fungus.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#c6613f] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">Optimize Distribution</h4>
                      <p className="text-gray-600">Plan efficient routes through high-demand zones and respond to consumer inquiries via secure chat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to connect supply with demand safely and efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <MapPin className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Interactive Heatmaps</h3>
              <p className="text-gray-600">
                Role-based visualization showing supply or demand density with color-coded intensity across regions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <Zap className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Points of Activity</h3>
              <p className="text-gray-600">
                Create multiple locations for production or delivery with capacity specifications for fresh and dry fungus.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <MessageSquare className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Secure In-App Chat</h3>
              <p className="text-gray-600">
                Real-time messaging that protects your privacy until you're ready to share personal contact information.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <Shield className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Privacy Protection</h3>
              <p className="text-gray-600">
                Use public landmarks instead of home addresses. Phone numbers stay hidden until you choose to share them.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <TrendingUp className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Market Intelligence</h3>
              <p className="text-gray-600">
                Visual density analysis helps identify high-demand zones and optimal distribution strategies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <Users className="w-10 h-10 text-[#c6613f] mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">Trust Building</h3>
              <p className="text-gray-600">
                Progressive disclosure model lets you verify legitimacy through conversation before sharing contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f4e8e4] rounded-2xl p-12 text-center">
            <Shield className="w-16 h-16 text-[#c6613f] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-black mb-4">Your Privacy, Our Priority</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Agariki is built with privacy at its core. Your phone number and exact address remain hidden until you choose to share them. Use public landmarks for locations, communicate through secure chat, and build trust before revealing personal details.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#c6613f] rounded-full"></div>
                No phone numbers displayed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#c6613f] rounded-full"></div>
                Public landmarks only
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#c6613f] rounded-full"></div>
                Progressive disclosure
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#c6613f] rounded-full"></div>
                Secure communication
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Agariki today and be part of Cameroon's fungus sector transformation. Whether you're a producer seeking demand insights or a consumer looking for reliable suppliers, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-[#c6613f] text-white px-8 py-4 rounded-lg hover:bg-[#a85434] font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/auth/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-black font-medium transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.black.svg" alt="Agariki" className="h-6 w-6" />
                <span className="font-bold text-black">Agariki</span>
              </div>
              <p className="text-gray-600 text-sm">
                Connecting Cameroon's fungus sector through location intelligence and secure communication.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#how-it-works" className="hover:text-[#c6613f]">How It Works</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">For Producers</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">For Consumers</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-[#c6613f]">About</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">Support</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#c6613f]">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Academic Project</h4>
              <p className="text-gray-600 text-sm">
                Wide Area Networks Course<br />
                Cloud Computing Application<br />
                Built for Cameroon 🇨🇲
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>© 2026 Agariki. Built with ❤️ for Cameroon's fungus sector.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}