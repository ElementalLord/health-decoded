import { createEntries } from "./create-entries";

export const careAndEmotionalTerms = createEntries(
  "Care team and emotional health",
  ["SRC-CDC-DSMES", "SRC-CDC-MENTAL", "SRC-CDC-PLAIN"],
  [
    [
      "Primary care professional",
      "A health professional who provides general care, preventive services, and coordination across health needs.",
      { aliases: ["Primary care provider", "PCP"] },
    ],
    [
      "Endocrinologist",
      "A physician with specialized training in hormones and conditions such as diabetes.",
    ],
    [
      "Diabetes care and education specialist",
      "A licensed or credentialed professional who helps people learn practical skills for living with diabetes.",
      {
        abbreviation: "CDCES",
        aliases: ["Certified diabetes care and education specialist", "Diabetes educator"],
      },
    ],
    [
      "Diabetes self-management education and support",
      "Personalized education and support that helps people build practical diabetes knowledge and skills.",
      { abbreviation: "DSMES" },
    ],
    [
      "Registered dietitian nutritionist",
      "A food and nutrition professional who has completed accredited education, supervised practice, and credentialing requirements.",
      {
        abbreviation: "RDN",
        confused: {
          term: "Nutritionist",
          explanation:
            "RDN is a regulated credential. Use and regulation of the title nutritionist vary by location.",
        },
      },
    ],
    [
      "Pharmacist",
      "A licensed health professional who prepares and dispenses medicines and helps people understand their safe use.",
    ],
    [
      "Ophthalmologist",
      "A physician specializing in medical and surgical eye care.",
      {
        confused: {
          term: "Optometrist",
          explanation:
            "Both provide eye care. Ophthalmologists are physicians who can provide the full range of medical and surgical eye treatment.",
        },
      },
    ],
    [
      "Optometrist",
      "A licensed eye-care professional who performs eye exams and treats many vision and eye conditions.",
      {
        confused: {
          term: "Ophthalmologist",
          explanation:
            "Both provide eye care, but their training and scope differ. Ophthalmologists are physicians and surgeons.",
        },
      },
    ],
    [
      "Podiatrist",
      "A health professional specializing in conditions affecting the feet and ankles.",
    ],
    ["Nephrologist", "A physician specializing in kidney health and kidney disease."],
    ["Cardiologist", "A physician specializing in the heart and blood vessels."],
    [
      "Behavioral health professional",
      "A trained professional who supports mental health, emotional well-being, or behavior change.",
    ],
    [
      "Diabetes distress",
      "Worry, frustration, or emotional burden connected with the ongoing demands of living with diabetes.",
    ],
    [
      "Diabetes burnout",
      "A period of feeling exhausted, detached, or overwhelmed by ongoing diabetes tasks. It is not a diagnosis.",
    ],
    [
      "Stigma",
      "Negative judgment, stereotyping, or unfair treatment connected with a characteristic or health condition.",
    ],
    [
      "Depression",
      "A health condition involving persistent changes in mood, interest, thinking, sleep, or daily functioning. Only a qualified professional can diagnose it.",
    ],
    [
      "Anxiety",
      "A state of worry, fear, or tension that can affect thoughts, feelings, and the body. A qualified professional evaluates anxiety disorders.",
    ],
    [
      "Diabetes peer support",
      "Support from people who share lived experience with diabetes, often through a group, program, or one-to-one connection.",
    ],
    [
      "Coping",
      "The thoughts and actions a person uses to respond to stress or difficult circumstances.",
    ],
    [
      "Support system",
      "People, groups, or services a person can turn to for practical or emotional support. Peer support may be one part of a support system.",
    ],
    [
      "Caregiver",
      "A person who provides ongoing practical, emotional, or physical care to someone else.",
      {
        confused: {
          term: "Supporter",
          explanation:
            "A caregiver often has an ongoing care role. A supporter may help in a narrower way chosen by the person receiving support.",
        },
      },
    ],
    [
      "Supporter",
      "A person invited to provide a specific kind of help while respecting the other person’s choices and privacy.",
    ],
    [
      "Boundary",
      "A limit a person sets around their time, body, information, space, or relationships.",
    ],
    [
      "Health literacy",
      "The ability to find, understand, and use health information and services.",
    ],
  ],
);
