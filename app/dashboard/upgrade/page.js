"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import React from "react";
import { toast } from "sonner";

// Reusable List Item Component
const PlanFeature = ({ text }) => (
  <li className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 text-indigo-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
    <span className="text-gray-700">{text}</span>
  </li>
);

const UpgradePlan = () => {
  //calling api from user 
  const userUpgradePlan = useMutation(api.user.userUpgradePlan);
  const {user} = useUser();

  const onPaymentSuccess = async () => {
    const result = await userUpgradePlan({userEmail: user?.primaryEmailAddress?.emailAddress});
    console.log(result);
    toast("Plan Upgraded Successfully");
  };
  
  return (
    <div className="max-w-3xl mx-auto px-2 py-4">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
        Plans
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Upgrade your plan to upload more PDFs and take better notes.
      </p>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
        {/* Pro Plan */}
        <div className="rounded-xl border border-indigo-600 bg-white p-6 shadow-md hover:shadow-lg hover:scale-105 transition-transform">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Pro Plan</h2>
            <p className="mt-4">
              <span className="text-4xl font-bold text-gray-900">$9</span>
              <span className="text-sm font-medium text-gray-600">/month</span>
            </p>
          </div>

          {/* Features */}
          <ul className="mt-6 space-y-4">
            <PlanFeature text="Unlimited PDF Uploads" />
            <PlanFeature text="Unlimited Note-Taking" />
            <PlanFeature text="Email Support" />
            <PlanFeature text="Gemini AI Access" />
          </ul>

          {/* PayPal Button */}
          <div className="mt-5">
            <PayPalButtons aria-label="PayPal Pro Plan Payment Button" 
              onApprove={() => onPaymentSuccess()}
              onCancel={() => console.log("Payment Cancel")}
              createOrder={(data,actions) => {
                return actions?.order?.create({
                  purchase_units: [
                    {
                      amount: {
                        value: 9,
                        currency_code: 'USD'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </div>

        {/* Free Plan */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg hover:scale-105 transition-transform">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Free Plan</h2>
            <p className="mt-4">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-sm font-medium text-gray-600">/month</span>
            </p>
          </div>

          {/* Features */}
          <ul className="mt-6 space-y-4">
            <PlanFeature text="5 PDF Uploads" />
            <PlanFeature text="Unlimited Note-Taking" />
            <PlanFeature text="Email Support" />
            <PlanFeature text="Gemini AI Access" />
          </ul>

          {/* Current Plan Button */}
          <div className="mt-8">
            <button
              className="block w-full rounded-full border border-indigo-600 bg-white px-6 py-3 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Current Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
