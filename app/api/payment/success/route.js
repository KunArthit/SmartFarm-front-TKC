export async function POST(request) {
  console.log('📨 POST request received at API payment success route');
  console.log('✅ This is the correct endpoint for 2C2P frontend callbacks');
  
  try {
    const url = new URL(request.url);
    let invoiceNo = url.searchParams.get('invoiceNo') || 'unknown';
    
    console.log('POST request details:', {
      url: url.toString(),
      invoiceNo,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    // Handle 2C2P payload
    let paymentResult = null;
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const body = await request.json();
        console.log('POST JSON body:', body);
        if (body.payload) {
          // This would be the 2C2P response - you'd decode it here
          paymentResult = body;
        }
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        const formDataObj = Object.fromEntries(formData);
        console.log('POST form data:', formDataObj);
        if (formDataObj.payload) {
          paymentResult = formDataObj;
        }
        // Also check if invoiceNo is in form data
        if (formDataObj.invoiceNo) {
          invoiceNo = formDataObj.invoiceNo;
        }
      } else {
        const text = await request.text();
        console.log('POST raw body:', text);
      }
    } catch (bodyError) {
      console.log('Could not parse POST body:', bodyError.message);
    }
    
    // Redirect to the actual payment success page
    // Use the correct base URL from environment or headers
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
                   `${url.protocol}//${request.headers.get('host') || url.host}`;
    const redirectUrl = new URL(`/payment/success?invoiceNo=${encodeURIComponent(invoiceNo)}`, baseUrl);
    console.log('🔄 Redirecting to payment success page:', redirectUrl.toString());
    
    return Response.redirect(redirectUrl, 302);
    
  } catch (error) {
    console.error('💥 POST handler error:', error);
    
    // Fallback redirect on error
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
                   `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`;
    const fallbackUrl = new URL('/payment/success?invoiceNo=unknown&error=true', baseUrl);
    return Response.redirect(fallbackUrl, 302);
  }
}

// Handle GET requests too (for direct browser access)
export async function GET(request) {
  console.log('📄 GET request received at API payment success route');
  
  try {
    const url = new URL(request.url);
    const invoiceNo = url.searchParams.get('invoiceNo') || 'unknown';
    
    console.log('GET request details:', {
      url: url.toString(),
      invoiceNo
    });
    
    // Redirect to the payment success page
    // Use the correct base URL from environment or headers
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
                   `${url.protocol}//${request.headers.get('host') || url.host}`;
    const redirectUrl = new URL(`/payment/success?invoiceNo=${encodeURIComponent(invoiceNo)}`, baseUrl);
    console.log('🔄 Redirecting GET to payment success page:', redirectUrl.toString());
    
    return Response.redirect(redirectUrl, 302);
    
  } catch (error) {
    console.error('💥 GET handler error:', error);
    
    // Fallback redirect
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
                   `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`;
    const fallbackUrl = new URL('/payment/success?invoiceNo=unknown', baseUrl);
    return Response.redirect(fallbackUrl, 302);
  }
}