import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownContentClass = "absolute left-1/2 top-full z-50 mt-2 w-auto -translate-x-1/2 rounded-md border bg-popover text-popover-foreground shadow-lg";

  const aboutLinks = [
    { title: t("navigation.missionAndVision"), href: "/about/mission", description: t("navigation.missionAndVisionDesc") },
    { title: t("navigation.history"), href: "/about/history", description: t("navigation.historyDesc") },
    { title: t("navigation.boardOfDirectors"), href: "/about/board", description: t("navigation.boardOfDirectorsDesc") },
  ];

  const resourcesLinks = [
    { title: t("navigation.resourcesTitle"), href: "/resources", description: t("navigation.resourcesDesc") },
    { title: t("navigation.publications"), href: "/archives/publications", description: t("navigation.publicationsDesc") },
  ];

  const supportLinks = [
    { title: t("navigation.membershipsVolunteers"), href: "/support/membership", description: t("navigation.membershipsVolunteersDesc") },
    { title: t("navigation.fundersSponsorsPartners"), href: "/support/partners", description: t("navigation.fundersSponsorsPartnersDesc") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#800000]/40 bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      {/* Main navigation */}
      <div className="container-kcssc">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/KCSSC_logo.jpg" 
              alt="KCSSC Logo" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu withViewport={false} className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="text-base font-bold h-12 px-4 text-[#800000] bg-transparent hover:bg-[#800000]/10 hover:text-[#800000] data-[state=open]:bg-[#800000]/10 data-[active]:bg-[#800000]/20">{t("navigation.about")}</NavigationMenuTrigger>
                <NavigationMenuContent className={dropdownContentClass}>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {aboutLinks.map((link) => (
                      <ListItem key={link.href} title={link.title} href={link.href}>
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/events" className="group inline-flex h-12 w-max items-center justify-center rounded-lg px-4 text-base font-bold text-[#800000] transition-colors hover:bg-[#800000]/10 hover:text-[#800000] focus:bg-[#800000]/10 focus:text-[#800000] focus:outline-none">
                    {t("navigation.events")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/programs" className="group inline-flex h-12 w-max items-center justify-center rounded-lg px-4 text-base font-bold text-[#800000] transition-colors hover:bg-[#800000]/10 hover:text-[#800000] focus:bg-[#800000]/10 focus:text-[#800000] focus:outline-none">
                    {t("navigation.programs")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/archives/gallery" className="group inline-flex h-12 w-max items-center justify-center rounded-lg px-4 text-base font-bold text-[#800000] transition-colors hover:bg-[#800000]/10 hover:text-[#800000] focus:bg-[#800000]/10 focus:text-[#800000] focus:outline-none">
                    {t("navigation.gallery")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="text-base font-bold h-12 px-4 text-[#800000] bg-transparent hover:bg-[#800000]/10 hover:text-[#800000] data-[state=open]:bg-[#800000]/10 data-[active]:bg-[#800000]/20">{t("navigation.supportUs")}</NavigationMenuTrigger>
                <NavigationMenuContent className={dropdownContentClass}>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {supportLinks.map((link) => (
                      <ListItem key={link.href} title={link.title} href={link.href}>
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="text-base font-bold h-12 px-4 text-[#800000] bg-transparent hover:bg-[#800000]/10 hover:text-[#800000] data-[state=open]:bg-[#800000]/10 data-[active]:bg-[#800000]/20">{t("navigation.resources")}</NavigationMenuTrigger>
                <NavigationMenuContent className={dropdownContentClass}>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {resourcesLinks.map((link) => (
                      <ListItem key={link.href} title={link.title} href={link.href}>
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/contact" className="group inline-flex h-12 w-max items-center justify-center rounded-lg px-4 text-base font-bold text-[#800000] transition-colors hover:bg-[#800000]/10 hover:text-[#800000] focus:bg-[#800000]/10 focus:text-[#800000] focus:outline-none">
                    {t("navigation.contact")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Donate Button, Language Switcher & Mobile Menu */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild className="hidden md:inline-flex">
              <Link to="/donate">{t("common.donate")}</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#800000] hover:text-[#800000] hover:bg-[#800000]/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#800000]/30 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <MobileNavGroup title={t("navigation.about")} links={aboutLinks} />
              <MobileNavLink href="/events">{t("navigation.events")}</MobileNavLink>
              <MobileNavLink href="/programs">{t("navigation.programs")}</MobileNavLink>
              <MobileNavLink href="/archives/gallery">{t("navigation.gallery")}</MobileNavLink>
              <MobileNavGroup title={t("navigation.supportUs")} links={supportLinks} />
              <MobileNavGroup title={t("navigation.resources")} links={resourcesLinks} />
              <MobileNavLink href="/contact">{t("navigation.contact")}</MobileNavLink>
              <MobileNavLink href="/donate">{t("common.donate")}</MobileNavLink>
            </nav>
            <div className="mt-4 pt-4 border-t border-[#800000]/30 flex flex-col gap-2">
              <a href="tel:+16135551234" className="flex items-center gap-2 text-[#800000] hover:text-[#800000]/80 py-2 font-bold">
                <Phone className="h-5 w-5" />
                <span>(613) 555-1234</span>
              </a>
              <a href="mailto:info@kcssc.ca" className="flex items-center gap-2 text-[#800000] hover:text-[#800000]/80 py-2 font-bold">
                <Mail className="h-5 w-5" />
                <span>info@kcssc.ca</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function ListItem({ className, title, children, href, ...props }: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent/20 focus:bg-accent/20",
            className
          )}
          {...props}
        >
          <div className="text-base font-semibold leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      className="block py-3 px-4 text-lg font-bold rounded-lg text-[#800000] hover:bg-[#800000]/10 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavGroup({ title, links }: { title: string; links: { title: string; href: string; description: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4 text-lg font-bold rounded-lg text-[#800000] hover:bg-[#800000]/10 transition-colors"
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 transition-transform text-[#800000]", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pl-4 mt-1 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block py-2 px-4 text-base text-[#800000]/80 hover:text-[#800000] rounded-lg hover:bg-[#800000]/10 transition-colors font-bold"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
