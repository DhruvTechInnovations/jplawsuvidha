"use client"
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Star, Shield, Users, Zap, Crown, Award, Phone, X, Building, Scale, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import plans from '@/Data/plans_data';
import Footer from './Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import { usePlan } from '@/context/PlansContext';
import regions from '@/Data/regions_data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

const FAQModal = ({ onClose }: { onClose: () => void }) => {
  const faqItems = [
    {
      question: "How does the subscription billing work?",
      answer: "Subscriptions are billed automatically based on your selected plan (monthly or half yearly). You'll receive an invoice 3 days before each billing cycle and can cancel anytime with 30 days notice."
    },
    {
      question: "What types of leads will I receive?",
      answer: "You'll receive verified leads from potential clients actively seeking legal services in your practice areas. All leads include contact information, case details, and urgency level."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan anytime. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. No fees for plan changes."
    },
    {
      question: "Is there a minimum contract period?",
      answer: "No, there are no long-term contracts. You can cancel your subscription anytime with 30 days written notice. We believe in earning your business through value."
    },
    {
      question: "How is my data protected?",
      answer: "We use bank-level encryption and comply with all legal industry standards including attorney-client privilege protection. All data is stored securely and never shared with third parties."
    },
    {
      question: "What support is included?",
      answer: "All plans include email support. Growth plan includes priority support (24hr response), and Pro Plus includes dedicated account management with real-time support."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600">Common questions about our subscription service</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-gray-200">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900 text-sm">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-sm">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-center flex-shrink-0">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800 transition-all duration-200 shadow-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};



function SubscriptionPlans() {
  // const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faq, setfaq] = useState(false)
  const { setSelectedPlan, selectedRegions, setSelectedRegions, setBillingCycle, billingCycle } = usePlan();
  const isHalfYearly = billingCycle === 'Half_Yearly';
  console.log('is half-yearly', isHalfYearly)
  const navigate = useRouter()
  useEffect(() => {

    return () => {
      setSelectedRegions({});
      setOpenSelect(null);
    }

  }, []);
  //   useEffect(() => {
  //   return () => {
  //     // Cleanup when leaving the page
  //     setSelectedRegions({});
  //     setOpenSelect(null);
  //   };
  // }, []);

  const iconMap = {
    Users,
    Zap,
    Crown,
    Building
  };
  type IconName = keyof typeof iconMap; // "Users" | "Zap" | "Crown" | "Building"

  // const [selectedRegions, setSelectedRegions] = useState<{ [key: string]: string[] }>({});
  const [openSelect, setOpenSelect] = useState<string | null>();


  const handleRegionSelect = (planName: string, region: string, limit: number) => {
    const current = selectedRegions[planName] || [];

    if (current.includes(region)) {
      // deselect region
      setSelectedRegions({
        ...selectedRegions,
        [planName]: current.filter(r => r !== region),
      });
    } else if (current.length < limit) {
      // select new region
      setSelectedRegions({
        ...selectedRegions,
        [planName]: [...current, region],
      });
    } else {
      toast.warning(`Maximum Regions Reached`, {
        description: `You can select only ${limit} region${limit > 1 ? 's' : ''} for ${planName} plan.`
      });
    }
  };


  const subscribeHandler = async (planName: string, price: string, icon: string, requiredRegions: number, cycle: 'Monthly' | 'Half_Yearly') => {
    const planRegions = selectedRegions[planName] || [];
    // console.log('planRegions',planRegions)
    if (isProcessing) return;
    setIsProcessing(true);
    try {

      // Check if user has selected at least one region
      if (requiredRegions > 0 && planRegions.length === 0) {
        toast.error("Region Selection Required", {
          description: `Please select at least one region for the ${planName} plan.`
        });
        return; // Don't proceed further
      }

      console.log('inside the subscribe handler', price)

      const plan = plans.find(p => p.name === planName);
      // If validation passes, proceed with subscription
      setSelectedPlan({
        name: planName,
        price,
        icon,
        regions: planRegions // Include selected regions in the plan data
      });
      setBillingCycle(cycle)
      navigate.push(`/register`);
    } catch (e) {
      alert('error occured while subscription')
    }
    finally {
      setIsProcessing(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}

      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Limited Time Offer - Up to 50% Off
          </div>
          <h2 className='underline'>  Want to join us as an Advocate ?</h2>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect subscription plan to accelerate your legal practice growth and connect with more clients than ever before.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Trusted</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>10,000+ Advocates</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="billing-toggle mb-4">
          <span className={!isHalfYearly ? 'active' : ''}>Monthly</span>
          <div
            className={`slider ${isHalfYearly ? 'Half_Yearly' : 'Monthly'}`}
            onClick={() => setBillingCycle(isHalfYearly ? 'Monthly' : 'Half_Yearly')}
          >
            <div className="knob" />
          </div>
          <span className={isHalfYearly ? 'active' : ''}>Half Yearly</span>
        </div>


        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = iconMap[plan.icon as IconName];
            const isSelected = plan.name;
            const isProcessingThis = isProcessing && isSelected;
            const planRegions = selectedRegions[plan.name] || [];

            return (
              <Card
                key={plan.name}
                className={` relative flex flex-col justify-between rounded-xl border ${plan.highlight ? 'border-orange-400 ring-2 ring-orange-300' : 'border-gray-200'
                  } shadow-sm overflow-visible`}
              >
                {/* Popular Badge */}
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-1 text-sm font-bold rounded-bl-lg z-20"
                    style={{ clipPath: 'inset(0 round 0 0.7rem 0 0)' }}>
                    {plan.badge}
                  </div>
                )}

                {/* Savings Badge */}
                {!plan.highlight && (
                  <div className="absolute top-4 right-4 z-20">
                    {/* {(plan.name !== 'Corporate' && plan.name !== 'Trial') &&
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {isHalfYearly ? plan.annualsavings : plan.savings}
                      </Badge>} */}
                  </div>
                )}
                <div className=''>
                  <CardHeader className={`bg-gradient-to-br ${plan.color} p-7 h-[300px]
                `} style={{ clipPath: 'inset(0 round 0.75rem 0.75rem 0 0)' }}>
                    <div className="flex  items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center `}>
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      <div >
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        {true && (
                          <p className="text-sm text-gray-700">
                            {plan.name === 'Growth' ? 'Chosen by Many' : plan.badge}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-700">{plan.name === 'Corporate' ? ' ' : isHalfYearly ? plan.annualdisprice : plan.price}</span>
                        <span className="text-gray-600">{plan.name === 'Corporate' ? ' ' : `/`}</span>
                        <span className="text-gray-600">{plan.name === 'Corporate' ? ' ' : isHalfYearly ? plan.annual : plan.period}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg text-gray-400 line-through">
                          {(plan.name !== 'Corporate' && plan.name !== 'Trial') ? isHalfYearly ? plan.annualprice : plan.originalPrice : ''}
                        </span>
                        {(plan.name !== 'Corporate' && plan.name !== 'Trial') &&
                          <div className="bg-green-100 text-green-700 text-base rounded-lg p-1">
                            {isHalfYearly ? plan.annualsavings : plan.savings}
                          </div>}
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{plan.description}</p>

                  </CardHeader>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow">
                  <ul className="space-y-2 mt-4 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        {feature.status ? (
                          <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        <span className={feature.status ? "" : "line-through text-gray-400"}>
                          {feature.label.includes('@') ? (
                            <>
                              {feature.label.split(' ').map((word, i) =>
                                word.includes('@') ? (
                                  <a key={i} href={`mailto:${word}`} className="text-blue-600 hover:underline">
                                    {word}{' '}
                                  </a>
                                ) : word + ' '
                              )}
                            </>
                          ) : (
                            feature.label
                          )}
                        </span>
                      </li>
                    ))}

                  </ul>
                  {/* Region dropdown only for plans that have regions > 0 */}
                  {(plan.regions ?? 0) > 0 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ">
                        Select up to {plan.regions} region{(plan.regions ?? 0) > 1 ? 's' : ''}
                      </label>

                      <div className="relative w-full">
                        <button
                          type="button"

                          onClick={() => {
                            const limit = plan.regions ?? 0;
                            const currentCount = selectedRegions[plan.name]?.length || 0;

                            // Toggle open, but don't close if limit not reached
                            if (openSelect === plan.name) {
                              if (currentCount < limit) {
                                setOpenSelect(null);
                              }
                            } else {
                              setOpenSelect(plan.name);
                            }
                          }}
                          className="w-full h-[40px] px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between hover:cursor-pointer"
                        >
                          <span className="flex-1">
                            {selectedRegions[plan.name]?.length > 0 ? (
                              <span className="flex items-center gap-2">
                                <span className="text-sm">
                                  {selectedRegions[plan.name].join(', ')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({selectedRegions[plan.name].length}/{plan.regions ?? 0})
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-500 hover:cursor-pointer">
                                Choose up to {plan.regions ?? 0} Region{(plan.regions ?? 0) > 1 ? 's' : ''}
                              </span>
                            )}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform  ${openSelect === plan.name ? 'rotate-180' : ''
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {openSelect === plan.name && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => {
                                const limit = plan.regions ?? 0;
                                const currentCount = selectedRegions[plan.name]?.length || 0;
                                if (currentCount <= limit) {
                                  setOpenSelect(null);
                                }
                              }}
                            />


                            {/* Dropdown */}
                            <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {regions.map((region) => {
                                const checked = (selectedRegions[plan.name] || []).includes(region);
                                const limit = plan.regions ?? 0;
                                const disabled = !checked && (selectedRegions[plan.name]?.length || 0) >= limit;

                                return (
                                  <button
                                    key={region}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => {
                                      if (!disabled) {
                                        handleRegionSelect(plan.name, region, plan.regions ?? 0);

                                        // Auto-close when limit reached
                                        const updatedRegions = selectedRegions[plan.name]
                                          ? [...selectedRegions[plan.name]]
                                          : [];

                                        if (!updatedRegions.includes(region) && updatedRegions.length + 1 >= limit) {
                                          // setTimeout(() => setOpenSelect(null), 1000);
                                        }
                                      }
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                      } ${checked ? 'bg-blue-50' : ''}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      readOnly
                                      className="w-4 h-4 accent-blue-600 pointer-events-none"
                                    />
                                    <span>{region}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>

                      {/* {planRegions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {planRegions.map((r) => (
                        <Badge key={r} variant="secondary" className="text-sm">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )} */}
                    </div>
                  )}

                  <Button
                    onClick={() => subscribeHandler(plan.name, isHalfYearly ? plan.annualdisprice : plan.price, plan.icon, plan.regions ?? 0, billingCycle)}
                    disabled={isProcessing}
                    className={`w-full h-12 font-semibold transition-all duration-200 mt-4  ${plan.highlight
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg cursor-pointer'
                      : 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer'
                      } ${isProcessingThis ? 'opacity-75' : ''}`}
                  >
                    {(
                      <>
                        {plan.highlight ? 'Subscribe' : 'Subscribe'}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    No setup fees • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our legal platform specialists are here to help you choose the right plan for your practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918019097373"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="flex flex-col text-left">
                    <span>Talk to an expert</span>
                  </span>
                </Button>
              </a>

              <Button
                variant='outline'
                className="border-gray-300 hover:bg-gray-50 cursor-pointer"
                onClick={() => setfaq(!faq)
                }
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
            <Shield className="w-4 h-4" />
            <span>All plans include enterprise-grade security and compliance features</span>
          </div>
        </div>
      </div>
      {faq && (
        <FAQModal onClose={() => setfaq(!faq)} />
      )}
      <Footer />
    </div>

  );
}

export default SubscriptionPlans;