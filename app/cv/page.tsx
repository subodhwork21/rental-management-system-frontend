import React from 'react';
import { Mail, Phone, MapPin, Calendar, Globe, Linkedin, User } from 'lucide-react';

const cvData = {
  personal: {
    name: "Subodh Acharya",
    title: "Full Stack Developer",
    phone: "9841240401",
    email: "subodhac.work@gmail.com",
    address: "Tikathali, Lalitpur, 44600 Kathmandu",
    dateOfBirth: "03-08-1996",
    placeOfBirth: "Kathmandu",
    gender: "Male",
    nationality: "Nepali",
    website: "https://portfolio-new-theta-flax.vercel.app/",
    linkedin: "https://linkedin.com/in/subodh-acharya-93600120b",
    image: "/image.png",
    summary: "As a full-stack developer skilled in PHP and Laravel for backend development, and React and Next.js for frontend, I deliver robust, scalable web solutions. My expertise in PHP and Laravel ensures efficient server-side functionality, while my experience with React and Next.js allows me to create dynamic, high-performance user interfaces. This blend of skills enables me to build comprehensive web applications, optimizing both functionality and user experience."
  },
  skills: [
    "Next JS",
    "Laravel", 
    "Core PHP",
    "Vanilla Javascript",
    "Tailwind CSS",
    "Git and Github"
  ],
  interests: [
    "Hiking",
    "Day out",
    "Listening to Music", 
    "Learning new facts about Technologies"
  ],
  experience: [
    {
      period: "Jul 2024 - Apr 2025",
      company: "Kumari Job, Hattisar, Kathmandu",
      position: "Full Stack Developer",
      description: "I built and maintained the Kumari Job website, utilizing vanilla JavaScript for the frontend and Laravel for the backend, ensuring a seamless and efficient user experience. Additionally, I developed API routes, optimized performance, and implemented secure authentication for various Next.js projects, enhancing both security and scalability. My contributions also extended to CRM and management systems, where I improved workflows and data handling, streamlining operations and boosting overall efficiency."
    },
    {
      period: "Jan 2024 - May 2024", 
      company: "Flyingcode Limited, Kathmandu & Ireland",
      position: "Frontend Developer",
      description: "I built and optimized user interfaces, enhancing performance, responsiveness, and SEO to deliver a seamless browsing experience. Additionally, I managed API routes, server responses, and data fetching using SSR, ISR, and CSR, ensuring efficient content delivery and improved scalability. I also integrated external APIs into WordPress, prioritizing security, cross-browser compatibility, and best practices to maintain a high-quality and reliable web experience."
    },
    {
      period: "May 2023 - Dec 2023",
      company: "Axis Software, Kathmandu", 
      position: "Junior Full Stack Developer",
      description: "I specialized in developing billing web applications, prioritizing both functionality and user experience to create efficient and user-friendly platforms. Using CodeIgniter and PHP, I built robust and scalable systems, optimizing database performance for faster processing and improved reliability. Additionally, I designed intuitive user interfaces with JavaScript and jQuery, ensuring a seamless and responsive billing experience for users."
    }
  ],
  education: [
    {
      period: "Jan 2021 - May 2024",
      institution: "The British College, Thapathali, Kathmandu",
      degree: "Bachelor of Computer Science",
      description: "Completed comprehensive computer science education focusing on software development, programming languages, and system design."
    },
    {
      period: "Aug 2013 - Aug 2015",
      institution: "National School of Sciences (NIST), Kathmandu", 
      degree: "Higher Secondary Education Board",
      description: "Completed higher secondary education with focus on science and mathematics, building foundation for computer science studies."
    }
  ],
  projects: [
    "Applymandu Website",
    "Axis Billing Software for APF Petrol pump",
    "Tapcreative Website", 
    "Kumari Job Pages",
    "Client Relational Management Website"
  ]
};

export default function SubodhCV() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-slate-700 text-white p-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img 
                src={cvData.personal.image} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mb-1">{cvData.personal.name}</h1>
            <p className="text-teal-400 text-sm">{cvData.personal.title}</p>
          </div>

          {/* Personal Info Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Personal</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-300">{cvData.personal.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Phone</p>  
                  <p className="text-gray-300">{cvData.personal.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-300 break-all">{cvData.personal.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Date of birth</p>
                  <p className="text-gray-300">{cvData.personal.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Gender</p>
                  <p className="text-gray-300">{cvData.personal.gender}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Nationality</p>
                  <p className="text-gray-300">{cvData.personal.nationality}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Website</p>
                  <a href={cvData.personal.website} className="text-teal-400 text-xs break-all hover:underline">
                    {cvData.personal.website}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Linkedin className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">LinkedIn</p>
                  <a href={cvData.personal.linkedin} className="text-teal-400 text-xs break-all hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Skills</h2>
            <ul className="space-y-2 text-sm">
              {cvData.skills.map((skill, index) => (
                <li key={index} className="text-gray-300">{skill}</li>
              ))}
            </ul>
          </div>

          {/* Interests Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Interests</h2>
            <ul className="space-y-2 text-sm">
              {cvData.interests.map((interest, index) => (
                <li key={index} className="text-gray-300">{interest}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {/* Summary Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 border-b-2 border-teal-400 pb-2">Professional Summary</h2>
            <p className="text-gray-600 leading-relaxed">{cvData.personal.summary}</p>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-teal-400 pb-2">Work Experience</h2>
            <div className="space-y-6">
              {cvData.experience.map((exp, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-32 flex-shrink-0">
                    <p className="text-sm font-semibold text-teal-600">{exp.period}</p>
                    <p className="text-xs text-teal-500">{exp.company}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-700 mb-2">{exp.position}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-teal-400 pb-2">Education and Qualifications</h2>
            <div className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-32 flex-shrink-0">
                    <p className="text-sm font-semibold text-teal-600">{edu.period}</p>
                    <p className="text-xs text-teal-500">{edu.institution}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-700 mb-2">{edu.degree}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-teal-400 pb-2">Projects and Contributions</h2>
            <div className="grid grid-cols-1 gap-3">
              {cvData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-slate-700">{project}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}