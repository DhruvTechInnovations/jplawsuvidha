"use client";

import { useState } from "react";
import {
    Shield,
    PhoneCall,
    School,
    Users,
    AlertTriangle,
    FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ChildLabourPage() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        location: "",
        description: "",
    });

    const immediateActions = [
        {
            title: `Call CHILDLINE ${<span className="font-bold text-red-600">1098</span>}`,
            desc: "Report children in distress or hazardous labour immediately.",
        },
        {
            title: "Inform Labour Department",
            desc: "Notify local labour authorities about illegal child employment.",
        },
        {
            title: "Document Evidence",
            desc: "Collect photos, videos, location details, and witness information.",
        },
        {
            title: "Seek Legal Support",
            desc: "Our legal experts can guide you through the complaint process.",
        },
    ];

    const violationTypes = [
        {
            icon: <AlertTriangle />,
            title: "Hazardous Factory Work",
        },
        {
            icon: <School />,
            title: "School Dropout Labour",
        },
        {
            icon: <Users />,
            title: "Domestic Child Labour",
        },
        {
            icon: <Shield />,
            title: "Bonded Child Labour",
        },
        {
            icon: <FileText />,
            title: "Forced Begging",
        },
        {
            icon: <PhoneCall />,
            title: "Child Trafficking Cases",
        },
    ];

    const evidenceChecklist = [
        "Photographs",
        "Video Evidence",
        "Location Address",
        "Employer Details",
        "Witness Information",
        "Child's Approximate Age",
        "Workplace Description",
        "Employment Records (if available)",
    ];

    const faqs = [
        {
            q: "Is child labour illegal in India?",
            a: "Employment of children below 14 years in most occupations is prohibited under Indian law.",
        },
        {
            q: "Can I report anonymously?",
            a: "Yes. Complaints can often be made without revealing your identity.",
        },
        {
            q: "What happens after reporting?",
            a: "Authorities may inspect the workplace, rescue the child, and initiate legal action.",
        },
        {
            q: "Can employers be punished?",
            a: "Yes. Violators may face fines, imprisonment, or both under applicable laws.",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">

            {/* HERO */}
            <div className="mx-auto max-w-6xl flex justify-center">
                <img
                    src="/child_labour.png"
                    alt="Child Labour Legal Assistance"
                    height={600}
                    width={800}

                />
            </div>

            <section className="text-center py-12">
                <p className="text-base sm:text-xl font-semibold max-w-3xl mx-auto">
                    Report child labour, child trafficking, bonded labour,
                    and exploitation. Get immediate legal guidance and support.
                </p>

                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                    <a
                        href="tel:1098"
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Call 1098
                    </a>

                    <a
                        href="https://pencil.gov.in"
                        target="_blank"
                        className="border border-black px-6 py-3 rounded-xl font-semibold"
                    >
                        Report Online
                    </a>
                </div>
            </section>

            {/* IMMEDIATE ACTIONS */}
            <section className="py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Immediate Actions
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {immediateActions.map((step, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>
                                    {index + 1}. {step.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {step.desc}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* TYPES */}
            <section className="bg-gray-50 py-12 px-4 rounded-xl">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Child Labour Issues We Assist With
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {violationTypes.map((item, index) => (
                        <Card
                            key={index}
                            className="flex items-center gap-3 p-4"
                        >
                            <div className="border rounded-md p-2">
                                {item.icon}
                            </div>

                            <span className="font-medium">
                                {item.title}
                            </span>
                        </Card>
                    ))}
                </div>
            </section>

            {/* EVIDENCE */}
            <section className="py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Evidence Checklist
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                    {evidenceChecklist.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-3 flex items-center gap-3"
                        >
                            <input type="checkbox" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* RIGHTS SECTION */}
            <section className="bg-black text-white rounded-2xl p-8 my-10">
                <h2 className="text-3xl font-bold mb-4">
                    Child Rights Protection
                </h2>

                <ul className="space-y-3">
                    <li>✓ Right to Education</li>
                    <li>✓ Protection from Hazardous Employment</li>
                    <li>✓ Protection from Exploitation</li>
                    <li>✓ Rehabilitation and Welfare Support</li>
                    <li>✓ Access to Legal Remedies</li>
                </ul>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto py-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Frequently Asked Questions
                </h2>

                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                        >
                            <AccordionTrigger>
                                {faq.q}
                            </AccordionTrigger>

                            <AccordionContent>
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    );
}