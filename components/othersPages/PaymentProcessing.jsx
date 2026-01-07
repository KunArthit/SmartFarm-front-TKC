"use client";

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react'; 
import dynamic from 'next/dynamic'; // ตรวจสอบว่า import dynamic มาแล้ว

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

function ProcessingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceNo = searchParams.get('invoiceNo');
    
    const intervalRef = useRef(null); 
    const attemptsRef = useRef(0);
    const [debugMessage, setDebugMessage] = useState('Initializing payment verification...');
    
    const POLLING_INTERVAL = 5000; // ถามทุก 5 วินาที
    const MAX_ATTEMPTS = 18; // พยายาม 18 ครั้ง (รวม 90 วินาที)

    useEffect(() => {
        if (!invoiceNo) {
            router.replace('/payment/notsuccess?message=NoInvoiceID');
            return;
        }

        const checkStatus = async () => {
            attemptsRef.current += 1;
            setDebugMessage(`Polling attempt ${attemptsRef.current}/${MAX_ATTEMPTS} for invoice: ${invoiceNo}`);
            
            try {
                const token = localStorage.getItem("access_token");
                
                const response = await fetch(`${API_BASE_URL}/payment/order/${invoiceNo}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store' // สั่งให้ Next.js "ห้ามจำ" (Bypass cache)
                }); 

                if (!response.ok) {
                    throw new Error(`Failed to fetch order status (HTTP ${response.status})`);
                }

                const data = await response.json();
                
                if (!data.order) {
                    throw new Error('Order data not found in response');
                }
                
                const paymentStatus = data.order?.payment_status; 
                const orderStatus = data.order?.order_status;
                
                console.log(`Current Statuses (Fresh Data): payment_status=${paymentStatus}, order_status=${orderStatus}`);

                // เมื่อ "การเงิน" (Payment) สำเร็จ
                if (paymentStatus === 'completed') {
                    clearInterval(intervalRef.current);
                    router.replace(`/payment/success?invoiceNo=${invoiceNo}&status=0000`);
                } 
                // เมื่อ "การเงิน" (Payment) ล้มเหลว
                else if (paymentStatus === 'failed') {
                    clearInterval(intervalRef.current);
                    router.replace(`/payment/notsuccess?invoiceNo=${invoiceNo}&message=PaymentFailed`);
                }
                // เมื่อ "ออเดอร์" (Order) ถูกยกเลิก
                else if (orderStatus === 'cancelled') {
                    clearInterval(intervalRef.current);
                    router.replace(`/payment/notsuccess?invoiceNo=${invoiceNo}&message=OrderCancelled`);
                }
                // ยังไม่มา... ให้รอต่อไป

            } catch (err) {
                console.error("Status check failed:", err);
                setDebugMessage(`Error: ${err?.message || err?.toString()}`);
            }

            if (attemptsRef.current >= MAX_ATTEMPTS) { 
                clearInterval(intervalRef.current);
                setDebugMessage("Confirmation timeout. Redirecting to orders page...");
                router.replace(`/my-account-orders`);
            }
        };

        if (!intervalRef.current) {
            checkStatus(); 
            intervalRef.current = setInterval(checkStatus, POLLING_INTERVAL); 
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

    }, [invoiceNo, router]);

    return (
        <section className="flex min-h-[60vh] flex-col items-center justify-center p-5 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800">Confirming Your Payment</h2>
            <p className="mt-4 text-lg text-gray-600">
                Please wait a moment, we are verifying your transaction...
            </p>
            <p className="mt-2 text-sm text-gray-500">
                This may take up to 90 seconds. Do not close this page.
            </p>
            <p className="mt-4 text-xs text-gray-400">
                Invoice: {invoiceNo}
            </p>
            <p className="mt-1 text-xs text-gray-400">
                Status: {debugMessage}
            </p>
        </section>
    );
}

// Disable SSR (โค้ดส่วนนี้ของคุณถูกต้อง)
const PaymentProcessingPage = dynamic(() => Promise.resolve(ProcessingContent), {
  ssr: false,
});

export default PaymentProcessingPage;