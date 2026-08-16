import os
import json
import urllib.request
import urllib.error
from django.conf import settings


class GeminiService:
    @staticmethod
    def get_api_key():
        return getattr(settings, 'GEMINI_API_KEY', os.getenv('GEMINI_API_KEY', ''))

    @staticmethod
    def is_available() -> bool:
        key = GeminiService.get_api_key()
        return bool(key and key.strip())

    @staticmethod
    def generate_career_guidance(prompt: str) -> str:
        """
        Calls Gemini REST API using standard urllib to generate AI career guidance.
        Falls back safely if API key is missing or request fails.
        """
        api_key = GeminiService.get_api_key()
        if not api_key:
            return ""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                candidates = res_data.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '').strip()
        except Exception as e:
            print(f"[GeminiService Warning] API request failed: {e}")
            return ""

        return ""
