"use client"

import { Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-background mt-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-1 gap-12">
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Contact us</h3>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">8500 Lorem Street</p>
                  <p className="text-sm text-muted-foreground">Chicago, IL 55030</p>
                  <p className="text-sm text-muted-foreground">Dolor sit amet</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <a
                  href="tel:+18001234567"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +8(800) 123 4567
                </a>
              </div>
              {/* Email */}
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <a
                  href="mailto:themesflat@support.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  themesflat@support.com
                </a>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center text-foreground"
              >
                <span className="text-sm font-semibold">f</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center text-foreground"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center text-foreground"
              >
                <span className="text-sm font-semibold">𝕏</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center text-foreground"
              >
                <span className="text-sm">♪</span>
              </a>
            </div>
          </div>

          {/* Shopping Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Shopping</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shop by Brand
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Track order
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Information</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Term & Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  News & Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Let's keep in touch</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email below to be the first to know about new collections and product launches.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-secondary text-foreground placeholder-muted-foreground border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <span>→</span>
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              By clicking subscribe, you agree to the{" "}
              <a href="#" className="underline hover:no-underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:no-underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-row md:flex-col items-center justify-between gap-6">
          {/* Links */}
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help & FAQs
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Factory
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Payment:</span>
            <div className="flex gap-2">
              <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                V
              </div>
              <div className="w-8 h-5 bg-orange-500 rounded text-xs text-white flex items-center justify-center font-bold">
                ●●
              </div>
              <div className="w-8 h-5 bg-blue-400 rounded text-xs text-white flex items-center justify-center font-bold">
                AX
              </div>
              <div className="w-8 h-5 bg-orange-600 rounded text-xs text-white flex items-center justify-center font-bold">
                D
              </div>
              <div className="w-8 h-5 bg-blue-700 rounded text-xs text-white flex items-center justify-center font-bold">
                P
              </div>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex gap-4">
            <select className="text-sm text-muted-foreground bg-background border border-border rounded px-3 py-1 cursor-pointer hover:border-foreground transition-colors">
              <option>🇺🇸 USD</option>
              <option>🇪🇺 EUR</option>
              <option>🇬🇧 GBP</option>
            </select>
            <select className="text-sm text-muted-foreground bg-background border border-border rounded px-3 py-1 cursor-pointer hover:border-foreground transition-colors">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}
