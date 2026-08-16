import re
import io
from pypdf import PdfReader


class ResumeParserService:
    @staticmethod
    def extract_text_from_pdf(file_input) -> str:
        """
        Extracts clean raw text from a PDF file object or file path using pypdf.
        """
        try:
            if isinstance(file_input, (str, bytes)):
                reader = PdfReader(file_input)
            else:
                # File-like object (e.g. UploadedFile or BytesIO)
                if hasattr(file_input, 'read'):
                    content = file_input.read()
                    if hasattr(file_input, 'seek'):
                        file_input.seek(0)
                    reader = PdfReader(io.BytesIO(content))
                else:
                    reader = PdfReader(file_input)

            extracted_pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)

            raw_text = "\n".join(extracted_pages)
            return raw_text.strip()
        except Exception as e:
            print(f"[ResumeParserService Error] Text extraction failed: {e}")
            return ""

    @staticmethod
    def parse_resume_text(raw_text: str) -> dict:
        """
        Parses raw text into structured resume fields:
        name, email, phone, skills, education, experience, projects
        """
        if not raw_text:
            return {
                "name": "",
                "email": "",
                "phone": "",
                "skills": "",
                "education": "",
                "experience": "",
                "projects": "",
                "parsed_data": {}
            }

        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]

        # 1. Extract Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        email = email_match.group(0) if email_match else ""

        # 2. Extract Phone Number
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
        phone = phone_match.group(0) if phone_match else ""

        # 3. Extract Name (Heuristic from top 5 lines)
        name = ""
        stop_words = {'resume', 'curriculum', 'vitae', 'cv', 'page', 'email', 'phone', 'contact', 'address', 'profile'}
        for line in lines[:5]:
            clean_line = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            words = clean_line.split()
            if 1 <= len(words) <= 4:
                lower_words = [w.lower() for w in words]
                if not any(w in stop_words for w in lower_words) and not re.search(r'[\w\.-]+@', line):
                    name = clean_line
                    break

        # 4. Extract Skills using tech stack taxonomy
        SKILL_TAXONOMY = [
            "React.js", "React", "Vue.js", "Angular", "Next.js", "Vite", "Node.js", "Express",
            "Python", "Django", "Flask", "FastAPI", "Java", "Spring Boot", "C++", "C#", ".NET",
            "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap",
            "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "GraphQL", "REST API",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "DevOps", "CI/CD", "Git", "GitHub",
            "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "NLP", "LLM"
        ]
        
        found_skills = []
        text_lower = raw_text.lower()
        for skill in SKILL_TAXONOMY:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)

        # 5. Extract Sections (Education, Experience, Projects)
        sections = ResumeParserService._extract_sections(raw_text)

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skills": ", ".join(found_skills),
            "education": sections.get("education", ""),
            "experience": sections.get("experience", ""),
            "projects": sections.get("projects", ""),
            "parsed_data": {
                "extracted_skills_count": len(found_skills),
                "sections_found": list(sections.keys())
            }
        }

    @staticmethod
    def _extract_sections(text: str) -> dict:
        """
        Segment resume text into major sections: Education, Experience, Projects.
        """
        section_headers = {
            "education": r'(?:education|academic background|qualifications|academic credentials)',
            "experience": r'(?:work experience|employment history|professional experience|experience|work history)',
            "projects": r'(?:projects|personal projects|key projects|academic projects)',
        }

        # Find line positions of headers
        lines = text.splitlines()
        header_indices = []

        for idx, line in enumerate(lines):
            line_clean = line.strip().lower()
            if len(line_clean) < 45: # Headers are usually concise
                for sec_key, pattern in section_headers.items():
                    if re.search(r'^' + pattern + r'\:?$', line_clean, re.IGNORECASE) or \
                       re.search(r'^#*\s*' + pattern + r'\:?$', line_clean, re.IGNORECASE):
                        header_indices.append((idx, sec_key))
                        break

        # Sort by line index
        header_indices.sort(key=lambda x: x[0])

        extracted = {"education": "", "experience": "", "projects": ""}

        for i, (start_idx, sec_name) in enumerate(header_indices):
            end_idx = header_indices[i + 1][0] if i + 1 < len(header_indices) else len(lines)
            section_content = "\n".join(lines[start_idx + 1:end_idx]).strip()
            if not extracted[sec_name]: # Keep first matching section content
                extracted[sec_name] = section_content[:1500] # Limit max length for UI safety

        return extracted
