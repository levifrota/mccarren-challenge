import OpenAi from 'openai';

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

console.log('API KEY: ', apiKey);


let openai: OpenAi | null = null;

openai = new OpenAi({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export async function generateCompanyProfile(companyUrl: string): Promise<CompanyProfile> {
  if (!openai) {
    throw new Error('OpenAI API not initialized');
  }

  try {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that analyzes company websites and creates structured profiles. Respond with JSON, following the structure below: 
              {
  "company_name": "",
  "website": "",
  "description": "",
  "service_lines": [
    "service 1",
    "service 2",
  ],
  "tier_1_keywords": [
    "keyword 1",
    "keyword 2",
  ],
  "tier_2_keywords": [
    "keyword 1",
    "keyword 2",
  ],
  "contacts": {
    "emails": [],
    "points_of_contact": []
  }
}`
            },
            {
              role: "user",
              content: `Generate a company profile in JSON format for the website: ${companyUrl}. Include company name, service lines, description, tier 1 keywords (that the company would use to search for government opportunities), tier 2 keywords (that they might use), and leave emails and points of contact empty for user input.`
            }
          ],
          response_format: { "type": "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No content in response');
        }

        try {
          const parsedData = JSON.parse(content);

          const validatedProfile: CompanyProfile = {
            company_name: typeof parsedData.company_name === 'string' ? parsedData.company_name : '',
            service_line: Array.isArray(parsedData.service_lines) ? parsedData.service_lines : [],
            company_description: typeof parsedData.description === 'string' ? parsedData.description : '',
            tier1_keywords: Array.isArray(parsedData.tier_1_keywords) ? parsedData.tier_1_keywords : [],
            tier2_keywords: Array.isArray(parsedData.tier_2_keywords)? parsedData.tier_2_keywords : [],
            emails: Array.isArray(parsedData.contacts.emails)? parsedData.contacts.emails : [],
            poc: Array.isArray(parsedData.contacts.points_of_contact)? parsedData.contacts.points_of_contact : [],
          };

          return validatedProfile;
        } catch (error) {
          console.error("Error parsing AI response:", error);
          throw error;
        }

      } catch (error) {
        console.error("Error generating company profile:", error);
        throw error;
      }
    } catch (error) {
      console.error('Error generating company profile:', error);
      throw new Error('Failed to generate company profile');
    }
}
