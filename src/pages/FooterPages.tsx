
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Check, Mail, MapPin, Phone, ArrowLeft, Zap, ShieldCheck, Printer, Smartphone, Globe, Activity, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageLayout = ({
    title,
    subtitle,
    children,
    className = ""
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="container mx-auto px-6 py-12 md:py-24 max-w-5xl relative z-10 flex-1">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}>
                {children}
            </div>
        </div>
    </div>
);

export const Features = () => (
    <PageLayout
        title="Features"
        subtitle="Tools designed to modernize your medical practice. Built for speed, security, and simplicity."
    >
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass border-primary/20 hover:border-primary/50 transition-colors group">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Smart Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        Create and save unlimited prescription templates for common diagnoses. Auto-fill complex medication regimens with a single click, saving hours of data entry every week.
                    </p>
                </CardContent>
            </Card>
            <Card className="glass border-primary/20 hover:border-primary/50 transition-colors group">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <Printer className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle className="text-2xl">Generate & Download Prescription</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        Instantly generate professional PDF prescriptions with a single click. Download, print, or share them securely with your patients.
                    </p>
                </CardContent>
            </Card>
            <Card className="glass border-primary/20 hover:border-primary/50 transition-colors group">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                        <Smartphone className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Multi-Device Sync</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        Your clinic in your pocket. Access securely from any device—laptop, tablet, or phone. All data is encrypted and synced instantly.
                    </p>
                </CardContent>
            </Card>
        </div>
    </PageLayout>
);

export const Pricing = () => (
    <PageLayout
        title="Simple, Transparent Pricing"
        subtitle="Start for free, upgrade as you grow. No hidden fees."
    >
        <div className="grid md:grid-cols-3 gap-8 pt-8">
            <Card className="glass flex flex-col justify-between hover:shadow-lg transition-all">
                <CardHeader>
                    <CardTitle className="text-2xl">Basic</CardTitle>
                    <CardDescription>For solo practitioners</CardDescription>
                    <div className="text-4xl font-bold mt-4">Free</div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> 5000 Prescriptions</li>
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> Unlimited Templates</li>
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> Standard Support</li>
                    </ul>
                    <Button variant="outline" className="w-full mt-6">Get Started</Button>
                </CardContent>
            </Card>

            <Card className="glass relative border-primary shadow-xl shadow-primary/10 scale-105 z-10 flex flex-col justify-between">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                    Most Popular
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl text-primary">Pro</CardTitle>
                    <CardDescription>For busy clinics</CardDescription>
                    <div className="text-4xl font-bold mt-4">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Unlimited Prescriptions</li>
                        <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Unlimited Templates</li>
                        <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Advanced Patient History</li>
                        <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Custom Branding & Logo</li>
                        <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                    </ul>
                    <Button className="w-full mt-6 shadow-lg shadow-primary/20">Upgrade to Pro</Button>
                </CardContent>
            </Card>

            <Card className="glass flex flex-col justify-between hover:shadow-lg transition-all">
                <CardHeader>
                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                    <CardDescription>For hospitals & chains</CardDescription>
                    <div className="text-4xl font-bold mt-4">Custom</div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> Multi-user Management</li>
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> API Access</li>
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> Custom Integrations</li>
                        <li className="flex items-center gap-2 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" /> SLA & Account Manager</li>
                    </ul>
                    <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
                </CardContent>
            </Card>
        </div>
    </PageLayout>
);

export const Testimonials = () => (
    <PageLayout
        title="Trusted by Doctors"
        subtitle="Join thousands of medical professionals who trust PrescriptionX for their daily practice."
    >
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass bg-muted/40 border-none">
                <CardContent className="pt-8">
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-4 text-yellow-500 fill-current">★</div>)}
                    </div>
                    <p className="text-lg italic text-foreground/80 leading-relaxed">
                        "PrescriptionX has completely transformed how I manage my clinic. It's fast, professional, and my patients love the clear, printed prescriptions. I can't imagine going back to handwriting."
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">SC</div>
                        <div>
                            <div className="font-semibold">Dr. Sarah Chen</div>
                            <div className="text-sm text-muted-foreground">Cardiologist, City Heart Center</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="glass bg-muted/40 border-none">
                <CardContent className="pt-8">
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-4 text-yellow-500 fill-current">★</div>)}
                    </div>
                    <p className="text-lg italic text-foreground/80 leading-relaxed">
                        "The template feature alone saves me at least an hour every day. The interface is clean, modern, and just works. Highly recommended for any busy practitioner."
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">JW</div>
                        <div>
                            <div className="font-semibold">Dr. James Wilson</div>
                            <div className="text-sm text-muted-foreground">General Practitioner</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </PageLayout>
);

export const FAQ = () => (
    <PageLayout title="Frequently Asked Questions" subtitle="Everything you need to know about PrescriptionX.">
        <Card className="glass">
            <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-medium">Is PrescriptionX HIPAA compliant?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Yes, we take security seriously. All data is encrypted at rest and in transit, and we follow all standard guidelines for data protection and privacy to ensure your patient data remains secure.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-medium">Can I upload my own logo?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Absolutely. It allows you to fully customize your prescription header with your clinic's logo, colors, and detailed contact information.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-medium">Is there a mobile app?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            PrescriptionX is a Progressive Web App (PWA), meaning it works beautifully on all mobile browsers and can be installed on your home screen to work just like a native app, without updates or app store downloads.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg font-medium">Can I export my data?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Yes, you can export your patient list and prescription history at any time in standard formats (CSV, PDF) for record-keeping or migration.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </PageLayout>
);

export const AboutUs = () => (
    <PageLayout title="About Us" subtitle="Building the future of healthcare technology.">
        <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground">
            <p>
                PrescriptionX was born from a simple observation: doctors spend too much time wrestling with outdated software and handwriting prescriptions, when they should be focused on patient care.
            </p>
            <p>
                Today, PrescriptionX serves thousands of clinics worldwide, helping them generate millions of secure, compliant prescriptions.
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pb-12">
            <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Active Doctors</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5M+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Prescriptions</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Uptime</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Support</div>
            </div>
        </div>
    </PageLayout>
);

export const Careers = () => (
    <PageLayout title="Join Our Team" subtitle="Help us build better tools for superheroes (doctors).">
        <div className="space-y-6">
            <Card className="glass hover:border-primary/50 cursor-pointer transition-all group">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="group-hover:text-primary transition-colors">Senior Frontend Engineer</CardTitle>
                        <div className="text-sm text-muted-foreground flex gap-4 mt-2">
                            <span className="flex items-center"><Globe className="h-3 w-3 mr-1" /> Remote</span>
                            <span className="flex items-center"><Activity className="h-3 w-3 mr-1" /> Full-time</span>
                        </div>
                    </div>
                    <Button variant="outline">Apply Now</Button>
                </CardHeader>
            </Card>
            <Card className="glass hover:border-primary/50 cursor-pointer transition-all group">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="group-hover:text-primary transition-colors">Product Designer</CardTitle>
                        <div className="text-sm text-muted-foreground flex gap-4 mt-2">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> New York, NY</span>
                            <span className="flex items-center"><Activity className="h-3 w-3 mr-1" /> Hybrid</span>
                        </div>
                    </div>
                    <Button variant="outline">Apply Now</Button>
                </CardHeader>
            </Card>
            <Card className="glass hover:border-primary/50 cursor-pointer transition-all group">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="group-hover:text-primary transition-colors">Customer Success Manager</CardTitle>
                        <div className="text-sm text-muted-foreground flex gap-4 mt-2">
                            <span className="flex items-center"><Globe className="h-3 w-3 mr-1" /> Remote</span>
                            <span className="flex items-center"><Activity className="h-3 w-3 mr-1" /> Full-time</span>
                        </div>
                    </div>
                    <Button variant="outline">Apply Now</Button>
                </CardHeader>
            </Card>
        </div>
    </PageLayout>
);

export const Blog = () => (
    <PageLayout title="Blog" subtitle="Insights, updates, and healthcare news.">
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-blue-500/20" />
                <CardHeader>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Technology</div>
                    <CardTitle className="group-hover:text-primary transition-colors">The Future of Digital Prescriptions</CardTitle>
                    <div className="text-sm text-muted-foreground mt-2">January 15, 2026 • 5 min read</div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80">How digital tools are reducing errors and improving patient adherence in modern clinics...</p>
                </CardContent>
            </Card>
            <Card className="glass hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
                <CardHeader>
                    <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Practice Tips</div>
                    <CardTitle className="group-hover:text-primary transition-colors">5 Tips for a More Efficient Clinic</CardTitle>
                    <div className="text-sm text-muted-foreground mt-2">December 28, 2025 • 3 min read</div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80">Simple changes you can make today to improve patient flow and reduce waiting times...</p>
                </CardContent>
            </Card>
        </div>
    </PageLayout>
);

export const Contact = () => (
    <PageLayout title="Contact Us" subtitle="We're here to help. Get in touch with our team.">
        <div className="grid md:grid-cols-2 gap-12">
            <Card className="glass">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                        <p className="text-muted-foreground mb-2">For general inquiries and support.</p>
                        <a href="mailto:support@prescriptionx.com" className="text-primary hover:underline">support@prescriptionx.com</a>
                    </div>
                </CardContent>
            </Card>
            <Card className="glass">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Phone</h3>
                        <p className="text-muted-foreground mb-2">Mon-Fri from 8am to 5pm EST.</p>
                        <a href="tel:+15551234567" className="text-primary hover:underline">+91 7411394186</a>
                    </div>
                </CardContent>
            </Card>

            {/* <Card className="glass">
                <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>We'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First name</label>
                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last name</label>
                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="jane@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="How can we help?" />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card> */}
        </div>
    </PageLayout>
);

export const PrivacyPolicy = () => (
    <PageLayout title="Privacy Policy" subtitle="Last updated: January 1, 2026">
        <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-12">
                    At PrescriptionX, we value your trust and are dedicated to protecting your privacy. This policy outlines our practices regarding data collection, use, and disclosure.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">1. Introduction</h2>
                <p>
                    Welcome to PrescriptionX ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@prescriptionx.com.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">2. Information We Collect</h2>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                </p>
                <ul className="list-disc pl-6 space-y-2 my-6 text-muted-foreground">
                    <li><strong>Personal Data:</strong> Name, email address, phone number, and professional credentials.</li>
                    <li><strong>Patient Data:</strong> De-identified or encrypted patient information processed on your behalf.</li>
                    <li><strong>Usage Data:</strong> Information about how you use our website and application.</li>
                </ul>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">3. How We Use Your Information</h2>
                <p>
                    We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                <p>
                    We use the information we collect or receive:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-6 text-muted-foreground">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send you administrative information.</li>
                    <li>To fulfill and manage your orders.</li>
                    <li>To protect our Services.</li>
                </ul>
            </div>
        </div>
    </PageLayout>
);

export const TermsOfService = () => (
    <PageLayout title="Terms of Service" subtitle="Last updated: January 1, 2026">
        <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-12">
                    Please read these Terms of Service ("Terms") carefully before using the PrescriptionX website and service operated by us.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">2. Accounts</h2>
                <p>
                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">3. Intellectual Property</h2>
                <p>
                    The Service and its original content, features and functionality are and will remain the exclusive property of PrescriptionX and its licensors.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">4. Termination</h2>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </div>
        </div>
    </PageLayout>
);

export const CookiePolicy = () => (
    <PageLayout title="Cookie Policy" subtitle="Understanding how and why we use cookies.">
        <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-12">
                    This Cookie Policy explains what cookies are and how we use them. You should read this policy so you can understand what type of cookies we use, or the information we collect using cookies and how that information is used.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">1. What are cookies?</h2>
                <p>
                    Cookies are small text files that are sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                </p>

                <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">2. How PrescriptionX uses cookies</h2>
                <p>
                    When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-6 text-muted-foreground">
                    <li>To enable certain functions of the Service.</li>
                    <li>To provide analytics.</li>
                    <li>To store your preferences.</li>
                    <li>To enable advertisements delivery, including behavioral advertising.</li>
                </ul>
            </div>
        </div>
    </PageLayout>
);

export const Sitemap = () => (
    <PageLayout title="Sitemap" subtitle="Navigate through our website.">
        <Card className="glass">
            <CardContent className="p-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4 text-primary">Product</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:underline text-muted-foreground hover:text-foreground">Home</Link></li>
                            <li><Link to="/features" className="hover:underline text-muted-foreground hover:text-foreground">Features</Link></li>
                            <li><Link to="/pricing" className="hover:underline text-muted-foreground hover:text-foreground">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-primary">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="hover:underline text-muted-foreground hover:text-foreground">About Us</Link></li>
                            <li><Link to="/careers" className="hover:underline text-muted-foreground hover:text-foreground">Careers</Link></li>
                            <li><Link to="/contact" className="hover:underline text-muted-foreground hover:text-foreground">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-primary">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link to="/blog" className="hover:underline text-muted-foreground hover:text-foreground">Blog</Link></li>
                            <li><Link to="/faq" className="hover:underline text-muted-foreground hover:text-foreground">FAQ</Link></li>
                            <li><Link to="/testimonials" className="hover:underline text-muted-foreground hover:text-foreground">Testimonials</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-primary">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link to="/privacy" className="hover:underline text-muted-foreground hover:text-foreground">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:underline text-muted-foreground hover:text-foreground">Terms</Link></li>
                            <li><Link to="/cookies" className="hover:underline text-muted-foreground hover:text-foreground">Cookies</Link></li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    </PageLayout>
);
