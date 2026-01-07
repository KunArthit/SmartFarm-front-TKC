// PaymentTester.jsx - Add this component to test your payment API
"use client";
import { useState } from "react";

export default function PaymentTester() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const testBasicPayment = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const testData = {
        invoiceNo: `TEST-${Date.now()}`,
        amount: "100.00",
        currency: "THB",
        description: "Test payment",
      };

      console.log("Testing with:", testData);

      const res = await fetch(`${API_BASE_URL}/payment/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        setError(`HTTP ${res.status}: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResponse(data);
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testWithNumber = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const testData = {
        invoiceNo: `TEST-${Date.now()}`,
        amount: 100.0, // Number instead of string
        currency: "THB",
        description: "Test payment with number",
      };

      console.log("Testing with number amount:", testData);

      const res = await fetch(`${API_BASE_URL}/payment/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        setError(`HTTP ${res.status}: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResponse(data);
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${API_BASE_URL}/payment/health`);
      const data = await res.json();

      console.log("Health check response:", data);
      setResponse(data);
    } catch (err) {
      console.error("Health check error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <h3>Payment API Tester</h3>
          <p>
            API Base URL: <code>{API_BASE_URL}</code>
          </p>

          <div className="d-flex gap-2 mb-4">
            <button
              className="btn btn-primary"
              onClick={testHealthEndpoint}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Health"}
            </button>

            <button
              className="btn btn-secondary"
              onClick={testBasicPayment}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Basic Payment (String)"}
            </button>

            <button
              className="btn btn-info"
              onClick={testWithNumber}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Payment (Number)"}
            </button>
          </div>

          {loading && (
            <div className="alert alert-info">
              <div className="spinner-border spinner-border-sm me-2"></div>
              Testing API...
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <h5>Error:</h5>
              <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
            </div>
          )}

          {response && (
            <div className="alert alert-success">
              <h5>Success Response:</h5>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4">
            <h5>Expected Request Format:</h5>
            <pre className="bg-light p-3">
              {`{
                "invoiceNo": "INV-1234567890",
                "amount": 100.00,           // or "100.00"
                "currency": "THB",
                "description": "Test payment"
              }`}
            </pre>
          </div>

          <div className="mt-4">
            <h5>Troubleshooting:</h5>
            <ul>
              <li>
                Check if your backend server is running on the correct port
              </li>
              <li>Verify CORS is enabled for your frontend domain</li>
              <li>Check environment variables: MERCHANT_ID, SECRET_KEY_2</li>
              <li>Look at backend console logs for detailed error messages</li>
              <li>Test health endpoint first to verify connectivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
