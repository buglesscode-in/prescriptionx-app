import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Building2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Printer,
  Pill,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-foreground">
              Prescription<span className="text-primary">X</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Prescriptions made <br />
              <span className="text-primary">Simple & Professional</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Streamline your medical practice with PrescriptionX. Create, manage, and print
              compliant prescriptions in seconds, not minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="gap-2 w-full sm:w-auto text-lg h-12 px-8 shadow-lg shadow-primary/20"
              >
                <Link to="/login">
                  <PlusCircle className="h-5 w-5" />
                  Create Prescription
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 w-full sm:w-auto text-lg h-12 px-8 bg-background/50 backdrop-blur-sm"
              >
                <Link to="/login">
                  <FileText className="h-5 w-5" />
                  Manage Templates
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      <div className="container mx-auto px-6 space-y-24 pb-20">
        {/* Quick Actions Grid (Preview) */}
        <section className="-mt-16 relative z-20">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                  New Prescription
                </CardTitle>
                <CardDescription>
                  Start a new patient consultation and generate a prescription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between group hover:bg-primary/5"
                >
                  <Link to="/login">
                    Start Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  Templates
                </CardTitle>
                <CardDescription>
                  Manage your medication templates for faster prescribing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between group hover:bg-blue-500/5"
                >
                  <Link to="/login">
                    View Templates
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-indigo-500" />
                  </div>
                  Hospital Settings
                </CardTitle>
                <CardDescription>
                  Configure your hospital details, logo, and doctor profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between group hover:bg-indigo-500/5"
                >
                  <Link to="/login">
                    Manage Settings
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose PrescriptionX?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for modern medical professionals who value efficiency and professionalism.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-primary/10 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Create prescriptions in seconds using our smart templates and intuitive interface.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-primary/10 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Professional & Secure</h3>
              <p className="text-muted-foreground">
                Generate compliant, professional-looking PDFs that enhance your practice's image.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-primary/10 rounded-full">
                <Printer className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Print Ready</h3>
              <p className="text-muted-foreground">
                One-click printing formatted perfectly for A4 paper with your custom letterhead.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">How it Works</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Set up your Profile</h4>
                    <p className="text-muted-foreground">
                      Add your hospital details and logo in Settings.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Templates</h4>
                    <p className="text-muted-foreground">
                      Save common medications as templates for quick access.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Generate & Print</h4>
                    <p className="text-muted-foreground">
                      Enter patient details, select meds, and print your prescription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-3xl">
                <FileText className="h-32 w-32 text-primary opacity-80" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
