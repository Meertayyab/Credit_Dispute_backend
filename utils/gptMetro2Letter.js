const useGPT = false; // 🔁 Toggle this to true when you want to use real OpenAI

let openai;
if (useGPT) {
  const { OpenAI } = require("openai");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

module.exports = async function generateMetro2Letter({
  fullName,
  address,
  cityStateZip,
  phone,
  dob,
  ssn,
  selectedLetterType,
  creditBureau,
  creditors,
  notaryLanguage
}) {
  const creditorLines = creditors
    .map((c, index) => `  ${index + 1}. ${c.name} (Account #: ${c.accountNumber})`)
    .join("\n");

  const prompt = `
You are an expert in credit repair and Metro 2 compliance. Please write a formal "${selectedLetterType}" addressed to the following credit bureau:

📍 Credit Bureau: ${creditBureau}

📌 Personal Information:
- Full Name: ${fullName}
- Address: ${address}
- City/State/ZIP: ${cityStateZip}
- Phone: ${phone}
- Date of Birth: ${dob}
- SSN: ${ssn}

📋 Disputed Credit Accounts:
${creditorLines}

🔒 Requirements:
- Format the letter professionally for legal compliance.
- Mention the disputed accounts clearly.
- Keep the tone assertive and respectful.
${notaryLanguage ? "- Include notary language at the end of the letter." : ""}

Return only the final letter content.
`;

  if (useGPT) {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return res.choices[0].message.content;
  } else {
    // ✅ Local testing fallback
    const letter = `
${fullName}
${address}
${cityStateZip}
Phone: ${phone}
DOB: ${dob}
SSN: ${ssn}

${new Date().toLocaleDateString()}

To: ${creditBureau}

Subject: ${selectedLetterType}

To Whom It May Concern,

I am writing to dispute the following inaccurate account(s) on my credit report:

${creditorLines}

These items are being reported incorrectly and are negatively impacting my creditworthiness. Please conduct a thorough investigation and update or remove the inaccurate information as required under the Fair Credit Reporting Act (FCRA).

${notaryLanguage ? "\nThis statement is true and accurate under penalty of perjury and may be notarized upon request." : ""}

Thank you for your prompt attention to this matter.

Sincerely,  
${fullName}
    `;

    return letter;
  }
};
