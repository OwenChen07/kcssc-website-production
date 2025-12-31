import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [familySupportHeight, setFamilySupportHeight] = useState<number | null>(null);
  const familySupportRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const measureHeight = () => {
      if (familySupportRef.current) {
        const height = familySupportRef.current.offsetHeight;
        if (height > 0) {
          setFamilySupportHeight(height);
        }
      }
    };

    // Measure after initial render
    measureHeight();
    
    // Also measure after a short delay to ensure images are loaded
    const timeout = setTimeout(measureHeight, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <footer style={{ backgroundColor: '#100E40', color: '#D8A9B1' }}>
      {/* Main Footer Content */}
      <div className="container-kcssc section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/KCSSC_logo.jpg"
                  alt="KCSSC Logo"
                  className="h-14 w-auto"
                />
              </Link>
              <div>
                <p className="text-lg font-bold" style={{ color: '#D8A9B1' }}>KCSSC</p>
                <p className="text-xs" style={{ color: '#D8A9B1', opacity: 0.8 }}>
                  Kanata Chinese Seniors Support Centre
                </p>
              </div>
            </div>
            <p className="leading-relaxed" style={{ color: '#D8A9B1', opacity: 0.9 }}>
              Supporting and enriching the lives of Chinese seniors in the
              Kanata community through programs, events, and services.
            </p>
          </div>

          {/* Sponsors */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#D8A9B1' }}>Our Sponsors & Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { src: "/SPCO.png", alt: "SPCO" },
                { src: "/HT.png", alt: "HT" },
                { src: "/Sobeys.png", alt: "Sobeys" },
                { src: "/Compassionate.png", alt: "Compassionate" },
                { src: "/FamilySupportAndCare.png", alt: "Family Support and Care" },
                { src: "/JFS.png", alt: "JFS" },
                { src: "/Library.png", alt: "Library" },
              ].map((logo) => {
                const isJFS = logo.src === "/JFS.png";
                const isFamilySupport = logo.src === "/FamilySupportAndCare.png";
                
                return (
                  <div
                    key={logo.src}
                    className="h-[100px] w-full flex items-center justify-center"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      ref={isFamilySupport ? familySupportRef : undefined}
                      className={`object-contain opacity-80 hover:opacity-100 transition-opacity ${
                        isJFS && familySupportHeight ? "" : "h-full w-full"
                      }`}
                      style={
                        isJFS && familySupportHeight
                          ? { height: `${familySupportHeight}px`, width: "auto", maxWidth: "100%" }
                          : undefined
                      }
                      onLoad={isFamilySupport ? () => {
                        if (familySupportRef.current) {
                          const height = familySupportRef.current.offsetHeight;
                          if (height > 0) {
                            setFamilySupportHeight(height);
                          }
                        }
                      } : undefined}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                asChild
                variant="outline"
                style={{ 
                  backgroundColor: 'rgba(216, 169, 177, 0.1)', 
                  borderColor: 'rgba(216, 169, 177, 0.2)',
                  color: '#D8A9B1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.1)';
                }}
              >
                <Link to="/support/partners">Become a Sponsor</Link>
              </Button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-6" style={{ color: '#D8A9B1' }}>Follow Us</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(216, 169, 177, 0.1)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.1)';
                }}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(216, 169, 177, 0.1)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(216, 169, 177, 0.1)';
                }}
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(216, 169, 177, 0.2)' }}>
        <div className="container-kcssc py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: '#D8A9B1', opacity: 0.8 }}>
          <p>
            © {new Date().getFullYear()} Kanata Chinese Seniors Support Centre.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link 
              to="/privacy" 
              className="transition-colors"
              style={{ color: '#D8A9B1' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D8A9B1';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D8A9B1';
                e.currentTarget.style.opacity = '0.8';
              }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/accessibility"
              className="transition-colors"
              style={{ color: '#D8A9B1' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D8A9B1';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D8A9B1';
                e.currentTarget.style.opacity = '0.8';
              }}
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}