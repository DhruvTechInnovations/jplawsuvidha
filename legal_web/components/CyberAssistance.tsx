"use client";

import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
    PhoneCall,
    ShieldAlert,
    LockKeyhole,
    Laptop,
    FileWarning,
    UserRoundCheck,
    Upload,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function CyberAssistancePage() {
    const { t } = useTranslation("services");

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        incidentType: "",
        incidentDate: "",
        description: "",
    });

    const emergencySteps = [
        {
            title: "Call 1930 Immediately",
            desc: "Report the fraudulent transaction to the national cyber helpline.",
        },
        {
            title: "Contact Your Bank",
            desc: "Block cards, UPI, and freeze suspicious transactions.",
        },
        {
            title: "Secure Accounts",
            desc: "Change passwords and enable two-factor authentication.",
        },
        {
            title: "Preserve Evidence",
            desc: "Save screenshots, messages, and transaction IDs.",
        },
    ];

    const cyberCrimes = [
        { icon: <ShieldAlert />, title: "Online Fraud" },
        { icon: <Laptop />, title: "Phishing Attacks" },
        { icon: <PhoneCall />, title: "UPI Fraud" },
        { icon: <LockKeyhole />, title: "Account Hacking" },
        { icon: <FileWarning />, title: "Identity Theft" },
        { icon: <UserRoundCheck />, title: "Cyber Harassment" },
    ];

    const evidenceList = [
        "Transaction ID",
        "Bank Statement",
        "Screenshots",
        "Phone Numbers",
        "Emails / Chats",
        "UPI Reference Number",
        "Fraud URL",
        "Device Logs (if available)",
    ];

    const faqs = [
        {
            q: "Can stolen money be recovered?",
            a: "Quick reporting increases chances of freezing and recovery of funds.",
        },
        {
            q: "Do I need to file an FIR?",
            a: "In serious cases, police complaint or FIR may be required.",
        },
        {
            q: "What if my social media account is hacked?",
            a: "Secure your account immediately and report through official channels.",
        },
    ];

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/cyber-assistance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert("Request submitted successfully");
                setForm({
                    name: "",
                    mobile: "",
                    email: "",
                    incidentType: "",
                    incidentDate: "",
                    description: "",
                });
            } else {
                alert("Failed to submit request");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* HERO */}
            <div className="mx-auto max-w-6xl">

                <img
                    src="/cyberAssistance.png"
                    alt="Cyber Assistance"
                />
            </div>

            <section className="text-center py-12 px-4">
                {/* <h1 className="text-4xl sm:text-5xl font-bold mt-6">
                    Cyber Assistance & Fraud Support
                </h1> */}

                <p className="text-base sm:text-xl text-black font-semibold mt-2 max-w-2xl mx-auto">
                    Immediate guidance for cyber fraud, hacking, phishing, and digital
                    financial crimes.
                </p>

                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                    <a
                        href="tel:1930"
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Call 1930
                    </a>

                    <a
                        href="https://cybercrime.gov.in"
                        target="_blank"
                        className="border border-black px-6 py-3 rounded-xl font-semibold"
                    >
                        Report Online
                    </a>
                </div>
            </section>

            {/* EMERGENCY STEPS */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Immediate Actions</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {emergencySteps.map((step, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">
                                    {i + 1}. {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-base sm:text-lg">
                                {step.desc}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CYBER CRIMES */}
            <section className="bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Types of Cyber Crimes We Handle
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cyberCrimes.map((c, i) => (
                            <Card key={i} className="flex items-center gap-3 p-4">
                                <div className="p-2 border rounded-md">{c.icon}</div>
                                <span className="font-medium text-base sm:text-lg">{c.title}</span>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* EVIDENCE */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Evidence Checklist</h2>

                <div className="grid md:grid-cols-2 gap-3">
                    {evidenceList.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 border p-3 rounded-lg text-base sm:text-lg"
                        >
                            <input type="checkbox" className="accent-black" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FORM */}
            {/* <section className="bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">
                        Request Cyber Assistance
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Mobile</Label>
                            <Input
                                value={form.mobile}
                                onChange={(e) =>
                                    setForm({ ...form, mobile: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Incident Type</Label>
                            <Input
                                value={form.incidentType}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        incidentType: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Date of Incident</Label>
                            <Input
                                type="date"
                                value={form.incidentDate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        incidentDate: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Submit Request
                        </Button>
                    </form>
                </div>
            </section> */}

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">FAQs</h2>

                <Accordion type="single" collapsible>
                    {faqs.map((f, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger>{f.q}</AccordionTrigger>
                            <AccordionContent>{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* STATUS */}
            {/* <section className="py-10 text-center">
                <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    🚧 Service Improving – More features coming soon
                </div>
            </section> */}
        </div>
    );
}