import { NextRequest, NextResponse } from 'next/server';
import { ContactsApi, ContactsApiApiKeys, CreateContact } from '@getbrevo/brevo';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize Brevo API
    const contactsApi = new ContactsApi();
    contactsApi.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    // Create contact object
    const createContact = new CreateContact();
    createContact.email = email;
    createContact.attributes = {
      FIRSTNAME: name,
    };

    // Submit to Brevo
    const result = await contactsApi.createContact(createContact);
    
    console.log('Contact created successfully:', result);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to waiting list!',
        success: true 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Brevo API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);

    // Handle duplicate email (contact already exists)
    if (error.response?.status === 400 && 
        (error.response?.data?.message?.includes('Contact already exist') || 
         error.response?.data?.code === 'duplicate_parameter')) {
      return NextResponse.json(
        { 
          message: 'You are already on our waiting list!',
          success: true 
        },
        { status: 200 }
      );
    }

    // Handle other API errors
    if (error.response?.status) {
      return NextResponse.json(
        { error: `API Error: ${error.response?.data?.message || 'Failed to subscribe. Please try again later.'}` },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}