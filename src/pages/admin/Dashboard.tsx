import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Settings, Plus, Edit, Trash2, LogOut, Image } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Admin Dashboard"
          description="Manage events, programs, and website content"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        >
          <Button variant="outline" onClick={handleLogout} className="ml-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </PageHeader>

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Events Management */}
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kcssc-red-light">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Events</CardTitle>
                      <CardDescription>Manage community events</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild className="w-full" variant="default">
                      <Link to="/admin/events">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Event
                      </Link>
                    </Button>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/admin/events">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Programs Management */}
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kcssc-gold-light">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Programs</CardTitle>
                      <CardDescription>Manage community programs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild className="w-full" variant="default">
                      <Link to="/admin/programs">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Program
                      </Link>
                    </Button>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/admin/programs">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Programs
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Management */}
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Image className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Photos</CardTitle>
                      <CardDescription>Manage event photos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild className="w-full" variant="default">
                      <Link to="/admin/photos">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Photo
                      </Link>
                    </Button>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/admin/photos">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Photos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>Website configuration</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline" disabled>
                    <Link to="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Coming Soon
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

