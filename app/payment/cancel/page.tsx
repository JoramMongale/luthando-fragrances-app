"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled and no charges were made to your account.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-gray-600">
                Order ID: <span className="font-medium">#{orderId.substring(0, 8)}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Your order is still saved and pending payment.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/checkout")}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              Try Again
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="btn btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-2">Need Help?</h3>
            <p className="text-yellow-800 text-sm">
              If you're experiencing issues with payment, please contact us via WhatsApp for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
