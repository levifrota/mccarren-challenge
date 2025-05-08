import Groq from 'groq-sdk';

// Define profile structure
export interface CompanyProfile {
  company_name: string;
  service_line: string[];
  company_description: string;
  tier1_keywords: string[];
  tier2_keywords: string[];
  emails: string[];
  poc: string[];
}

const apiKey = import.meta.env.VITE_OPENAI_KEY;

// Import Groq SDK
const groq = new Groq({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export async function generateCompanyProfile(
  companyUrl: string
): Promise<CompanyProfile> {
  if (!groq) {
    throw new Error('AI API not initialized');
  }

  try {
    // Call Groq API to generate the profile
    const response = await groq.chat.completions.create({
      // Using Llama 3
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that analyzes company websites and creates structured profiles. Respond with JSON, following the structure below: 
          {
  "company_name": "",
  "service_line": [
    "service 1",
    "service 2",
  ],
  "company_description": "",
  "tier1_keywords": [
    "keyword 1",
    "keyword 2",
  ],
  "tier2_keywords": [
    "keyword 1",
    "keyword 2",
  ],
  "emails": [],
  "poc": []
}`,
        },
        {
          role: 'user',
          content: `Generate a company profile in JSON format for the website: ${companyUrl}. Include company name, service lines, description, tier 1 keywords (that the company would use to search for government opportunities), tier 2 keywords (that they might use), and leave emails and points of contact empty for user input. Make sure to follow the JSON structure provided and only include the fields specified. Do not add any additional information or context. The response should be a valid JSON object.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    // Get response content
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    try {
      // Parse the JSON response
      const parsedData = JSON.parse(content);

      // Validate generated data
      const validatedProfile: CompanyProfile = {
        company_name:
          typeof parsedData.company_name === 'string'
            ? parsedData.company_name
            : '',
        service_line: Array.isArray(parsedData.service_line)
          ? parsedData.service_line
          : [],
        company_description:
          typeof parsedData.company_description === 'string'
            ? parsedData.company_description
            : '',
        tier1_keywords: Array.isArray(parsedData.tier1_keywords)
          ? parsedData.tier1_keywords
          : [],
        tier2_keywords: Array.isArray(parsedData.tier2_keywords)
          ? parsedData.tier2_keywords
          : [],
        emails: Array.isArray(parsedData.emails) ? parsedData.emails : [],
        poc: Array.isArray(parsedData.poc) ? parsedData.poc : [],
      };

      return validatedProfile;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error generating company profile:', error);
    throw new Error('Failed to generate company profile');
  }
}
