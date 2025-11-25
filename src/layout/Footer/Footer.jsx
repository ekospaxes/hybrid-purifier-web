import React from 'react';
import { Atom, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 px-6 text-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-eko-emerald/20 p-1.5 rounded-full">
                <Atom className="w-4 h-4 text-eko-emerald" />
              </div>
              <span className="text-white font-bold tracking-tight">EKOSPAXES</span>
            </div>
            <p className="text-gray-500 mb-6">
              Integrating nature-based technologies into urban India.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Github} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-gray-500">
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Class X 120L</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Technology</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Sensors</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Research Data</li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-500">
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Contact</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-eko-emerald cursor-pointer transition-colors">Terms of Use</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-500">
              <li>
                <a href="mailto:info@ekospaxes.com" className="hover:text-eko-emerald transition-colors">
                  info@ekospaxes.com
                </a>
              </li>
              <li>New Delhi, India</li>
              <li className="text-xs mt-4 text-gray-600">
                Designed for Science & Innovation Display
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {currentYear} Ekospaxes Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }) => (
  <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
    <Icon size={16} />
  </a>
);

export default Footer;