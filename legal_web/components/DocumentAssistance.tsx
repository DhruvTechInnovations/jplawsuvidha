"use client";

import { useState } from "react";
import {
    FileText,
    ShieldAlert,
    FileSignature,
    Scale,
    Briefcase,
    ScrollText,
    Eye,
    Download,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

export default function DocumentAssistancePage() {


    const documents = [
        {
            key: "fir",
            icon: "shield",
            title: "FIR Templates",
            description: "Draft FIR formats for common complaints.",
            templates: [
                { id: "general-fir", name: "General FIR Complaint" },
                { id: "cyber-fir", name: "Cyber Crime FIR" },
            ],
        },
        {
            key: "affidavit",
            icon: "signature",
            title: "Affidavits",
            description: "Ready-to-use affidavit formats.",
            templates: [
                { id: "address-affidavit", name: "Address Proof Affidavit" },
                { id: "name-change-affidavit", name: "Name Change Affidavit" },
            ],
        },
        {
            key: "poa",
            icon: "scale",
            title: "Power of Attorney",
            description: "General POA templates.",
            templates: [
                { id: "general-poa", name: "General POA" },
            ],
        },
        {
            key: "agreements",
            icon: "scroll",
            title: "Legal Agreements",
            description: "Basic agreement drafts.",
            templates: [
                { id: "rental-agreement", name: "Rental Agreement" },
                { id: "service-agreement", name: "Service Agreement" },
            ],
        },
    ];
    const [selected, setSelected] = useState<any>(documents[0]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "What is the purpose of these document templates?",
            a: "These templates help users draft legal documents like FIRs, affidavits, agreements, and complaints in a structured format.",
        },
        {
            q: "Are these documents legally valid?",
            a: "They are standard legal formats. We recommend reviewing them with a legal professional before submission.",
        },
        {
            q: "Can I download and edit these documents?",
            a: "Yes, all templates are downloadable and editable depending on the format provided.",
        },
        {
            q: "Do I need an account to access documents?",
            a: "Currently no account is required. Future updates may require login for secure access.",
        },
        {
            q: "Will more templates be added?",
            a: "Yes, we continuously expand our library based on user needs.",
        },
        {
            q: "Is this service free?",
            a: "Basic templates are free. Advanced legal templates may be part of premium plans later.",
        },
    ];
    const steps = [
        {
            title: "Choose Document Type",
            desc: "Select from FIRs, affidavits, agreements, and other legal templates based on your need.",
        },
        {
            title: "Download Document",
            desc: "Download the completed document in PDF or editable format and fill your details.",
        },
        {
            title: "File with Authority",
            desc: "Submit the document to the relevant authority such as police station, court, or office.",
        },
    ];
    const getIcon = (icon: string) => {
        switch (icon) {
            case "shield":
                return <ShieldAlert className="w-5 h-5" />;
            case "signature":
                return <FileSignature className="w-5 h-5" />;
            case "scale":
                return <Scale className="w-5 h-5" />;
            case "scroll":
                return <ScrollText className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="mx-auto max-w-6xl mb-10">

                <img
                    src="/DocumentAssistance.png"
                    alt="DocumentAssistance"
                />
            </div>
            <section>
                <div className="max-w-6xl mx-auto mt-10 px-4">

                    {/* HEADER */}
                    <div className="text-center mb-10">
                        {/* <h2 className="text-3xl sm:text-4xl font-bold">
                            Document Assistance Made Simple
                        </h2> */}
                        <p className="text-base sm:text-xl text-black font-semibold mt-2 max-w-2xl mx-auto">
                            We help you prepare structured legal documents and guide you
                            step-by-step on how to file them correctly.
                        </p>
                    </div>

                    {/* STEPS */}
                    <div className="flex gap-6 mb-12 max-w-6xl mx-auto">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl justify-content-center"
                            >
                                <div className="flex h-full flex-col">
                                    {/* Step Badge */}
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                                            {i + 1}
                                        </div>

                                        <div>
                                            <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
                                                Step {i + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-3 text-xl font-semibold text-slate-900">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="flex-grow text-base leading-relaxed text-slate-600">
                                        {step.desc}
                                    </p>

                                    {/* Bottom Accent */}
                                    <div className="mt-6 h-1 w-0 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT LIST */}
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.key}
                            onClick={() => setSelected(doc)}
                            className={`p-4 border rounded-xl cursor-pointer transition flex items-center gap-3 ${selected?.key === doc.key
                                ? "bg-blue-50 border-blue-500"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            {getIcon(doc.icon)}
                            <div>
                                <h3 className="font-medium text-base sm:text-lg">
                                    {doc.title}
                                </h3>
                                <p className="text-base sm:text-lg text-gray-500">
                                    {doc.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT PANEL */}
                <div className="md:col-span-2 border rounded-2xl p-6 min-h-[400px] bg-white">

                    {!selected ? (
                        <div className="text-gray-400 text-sm">
                            Select a document category to view templates
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                                {selected.title}
                            </h2>

                            <p className="text-base sm:text-lg text-gray-500 mb-6">
                                {selected.description}
                            </p>

                            <div className="space-y-3">
                                {selected.templates.map((t: any) => (
                                    <div
                                        key={t.id}
                                        className="border rounded-xl p-4 flex items-center justify-between"
                                    >
                                        <span className="text-base sm:text-lg font-medium">
                                            {t.name}
                                        </span>

                                        <div className="flex gap-2">
                                            {/* <a
                                                href={`/api/documents/${t.id}/view`}
                                                className="p-2 border rounded-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a> */}

                                            <a
                                                href={`/api/documents/${t.id}/download`}
                                                className="p-2 border rounded-lg"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>

            </div>
            <section>

                <div className="max-w-4xl mx-auto mt-16 px-4">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-semibold">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base sm:text-lg text-gray-500 mt-2">
                            Everything about document templates and usage
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="border-b bg-white"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : index)
                                        }
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                                    >
                                        <span className="text-sm font-medium text-gray-900 text-base sm:text-lg">
                                            {item.q}
                                        </span>

                                        {isOpen ? (
                                            <ChevronUp className="w-4 h-4 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>

                                    <div
                                        className={`px-4 text-base sm:text-lg text-gray-600 overflow-hidden transition-all duration-300 ${isOpen
                                            ? "max-h-40 pb-4 opacity-100"
                                            : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        {item.a}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}