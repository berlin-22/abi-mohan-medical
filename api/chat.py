import http.server
import json
import os
import requests

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def _load_env():
    for candidate in [".env", os.path.join(os.path.dirname(__file__), ".env"), os.path.join(os.path.dirname(__file__), "..", ".env")]:
        if os.path.exists(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            except Exception:
                pass
            break
_load_env()

NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
PRIMARY_MODEL = "meta/llama-3.2-11b-vision-instruct"

# Persistent session for keep-alive
HTTP_SESSION = requests.Session()
HTTP_SESSION.headers.update({
    "Authorization": f"Bearer {NVIDIA_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "text/event-stream"
})

def build_system_prompt():
    return """நீங்கள் "ABI Mohan Medical" (ஏபிஐ மோகன் மெடிக்கல்) மருந்தகம் மற்றும் மருத்துவ மையத்தின் வாடிக்கையாளர் சேவை AI உதவியாளர்.

கட்டாய விதிகள் (STRICT RULES):
1. மொழி விதி: பயனர் ஆங்கிலம் அல்லது தமிழில் கேட்டாலும், உங்கள் பதில் 100% தூய தமிழ் மொழியிலேயே (Tamil Script) இருக்க வேண்டும்.
2. உரிமையாளர் விவரம்:
   - உரிமையாளர் மற்றும் மேலாளர்: திருமதி. வனிதா பிரகாஷ்வேல் (Vanitha Prakashvel).
   - கல்வித் தகுதி: D.Pharm (Diploma in Pharmacy).
   - முக்கியக் குறிப்பு: இவர் மருத்துவர் (Doctor) அல்ல! D.Pharm முடித்து மருந்தகங்களில் வேலை செய்து அனுபவம் பெற்ற மருந்தாளர் (Experienced Pharmacist). தற்போது சொந்தமாக ABI Mohan Medical மருந்தகத்தை நடத்தி வருகிறார்.
3. தொடர்பு & முகவரி:
   - முகவரி: 20, மெயின் ரோடு தெரு, மாத்தூர், விருத்தாசலம், தமிழ்நாடு 606104 (Plus Code: J83M+QJ Mathur).
   - தொலைபேசி: 080566 68839 | வாட்ஸ்அப்: +91 80566 68839.
   - வேலை நேரம்: 24 மணி நேரமும் திறந்திருக்கும் (Open 24 Hours).
4. சேவைகள்:
   - 24 மணி நேர அவசர மருந்தகம் (காய்ச்சல், சளி, வலி மாத்திரைகள், BP, சுகர் மருந்துகள், இன்சுலின்).
   - முதலுதவி மற்றும் உடனடி BP & சுகர் பரிசோதனை.
   - வாட்ஸ்அப் மூலம் மருந்துச் சீட்டு ஆர்டர்.
5. வாடிக்கையாளர் கேள்விக்கு ஏற்ப சுருக்கமாக 2 அல்லது 3 முழுமையான வாக்கியங்களில் தமிழில் விரைவாகப் பதிலளிக்கவும்."""

def get_instant_faq(query):
    q = query.lower().strip()
    phone = "080566 68839"
    addr = "20, மெயின் ரோடு தெரு, மாத்தூர், விருத்தாசலம், தமிழ்நாடு 606104"

    if any(k in q for k in ["உரிமையாளர்", "who is the owner", "who is owner", "who is vanitha", "who is the vanitha", "வனிதா யார்", "யார் உரிமையாளர்"]):
        return "ABI Mohan Medical மருந்தகத்தின் உரிமையாளர் மற்றும் மேலாளர் **திருமதி. வனிதா பிரகாஷ்வேல் (Vanitha Prakashvel)** ஆவார். இவர் மருத்துவர் அல்ல; **D.Pharm (Diploma in Pharmacy)** பட்டயப்படிப்பு முடித்து, மருந்தகங்களில் பணிபுரிந்து சிறந்த முன் அனுபவம் பெற்ற மருந்தாளர் (Experienced Pharmacist). தற்போது மாத்தூரில் சொந்தமாக இந்த புதிய மருந்தகத்தை நிறுவி நடத்தி வருகிறார்."
    if any(k in q for k in ["திறந்திருக்கிறதா", "திறந்திருக்கும்", "is it open", "open now", "opening hours", "open 24", "timing"]):
        return f"ஆம்! ABI Mohan Medical **24 மணி நேரமும் (24 Hours)** தொடர்ந்து திறந்திருக்கும். நள்ளிரவு மற்றும் விடுமுறை நாட்களிலும் அவசர மருந்துகளுக்கு எங்களை **{phone}** என்ற எண்ணில் எப்போது வேண்டுமானாலும் அழைக்கலாம்."
    if any(k in q for k in ["முகவரி", "address", "location", "எங்கு உள்ளது", "where is it located"]):
        return f"எங்கள் முகவரி: **{addr}** (Google Plus Code: `J83M+QJ Mathur`). மாத்தூர் மெயின் ரோட்டில் அமைந்துள்ளது. அவசர உதவிக்கு: **{phone}**."
    if any(k in q for k in ["வாட்ஸ்அப் ஆர்டர்", "whatsapp order", "order medicine", "சீட்டு"]):
        return "உங்கள் மருந்துச் சீட்டை அல்லது தேவைப்படும் மருந்துகளின் பட்டியலை எங்கள் வாட்ஸ்அப் எண்ணிற்கு (**+91 80566 68839**) அனுப்பி எளிதாக ஆர்டர் செய்யலாம்."
    if any(k in q for k in ["bp check", "sugar check", "இரத்த அழுத்தம்", "சர்க்கரை பரிசோதனை"]):
        return "எங்கள் மருத்துவ மையத்தில் இரத்த அழுத்தம் (BP) மற்றும் இரத்த சர்க்கரை அளவு (RBS Sugar) பரிசோதனைகள் அப்பாயிண்ட்மென்ட் இன்றி உடனுக்குடன் செய்து தரப்படும்."
    return None

def generate_dynamic_fallback(query):
    q = query.lower()
    phone = "080566 68839"
    addr = "20, மெயின் ரோடு தெரு, மாத்தூர், விருத்தாசலம், தமிழ்நாடு 606104"

    if any(k in q for k in ["உரிமையாளர்", "யார்", "owner", "who", "manage", "வனிதா", "vanitha"]):
        return f"ABI Mohan Medical மருந்தகத்தின் உரிமையாளர் மற்றும் மேலாளர் **திருமதி. வனிதா பிரகாஷ்வேல் (Vanitha Prakashvel)** ஆவார். இவர் மருத்துவர் அல்ல; **D.Pharm (Diploma in Pharmacy)** பட்டயப்படிப்பு முடித்து, மருந்தகங்களில் பணிபுரிந்து சிறந்த முன் அனுபவம் பெற்ற மருந்தாளர் (Experienced Pharmacist). தற்போது மாத்தூரில் சொந்தமாக இந்த புதிய மருந்தகத்தை நிறுவி நடத்தி வருகிறார்."
    elif any(k in q for k in ["திறந்த", "நேரம்", "time", "open", "hour", "இரவு"]):
        return f"ஆம்! ABI Mohan Medical **24 மணி நேரமும்** தொடர்ந்து திறந்திருக்கும். நள்ளிரவு மற்றும் விடுமுறை நாட்களிலும் அனைத்து அவசர மருந்துகளும் உடனடியாகக் கிடைக்கும். தொடர்பு எண்: {phone}."
    elif any(k in q for k in ["முகவரி", "எங்கு", "address", "location", "place"]):
        return f"எங்கள் முகவரி: **{addr}** (Google Plus Code: `J83M+QJ Mathur`). மாத்தூர் மெயின் ரோட்டில் அமைந்துள்ளது. அவசர உதவிக்கு: {phone}."
    elif any(k in q for k in ["ஆர்டர்", "வாட்ஸ்அப்", "order", "whatsapp", "சீட்டு"]):
        return f"உங்கள் மருந்துச் சீட்டை அல்லது தேவைப்படும் மருந்துகளின் பட்டியலை எங்கள் வாட்ஸ்அப் எண்ணிற்கு (**+91 80566 68839**) அனுப்பி எளிதாக ஆர்டர் செய்யலாம்."
    elif any(k in q for k in ["bp", "sugar", "சுகர்", "பிபி", "பரிசோதனை"]):
        return f"எங்கள் மருத்துவ மையத்தில் இரத்த அழுத்தம் (BP) மற்றும் இரத்த சர்க்கரை அளவு (RBS Sugar) பரிசோதனைகள் அப்பாயிண்ட்மென்ட் இன்றி உடனுக்குடன் செய்து தரப்படும்."
    else:
        return f"வணக்கம்! ABI Mohan Medical (உரிமையாளர்: வனிதா பிரகாஷ்வேல்) மாத்தூரில் 24 மணி நேரமும் செயல்படுகிறது. மேலும் தகவல்களுக்கு எங்களை {phone} என்ற எண்ணில் அழைக்கலாம்."

class handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/chat"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "service": "ABI Mohan Medical Chatbot"}).encode("utf-8"))
            return
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 65536:
            self.send_error(413, "Payload Too Large")
            return
        post_body = self.rfile.read(content_length)

        try:
            data = json.loads(post_body.decode("utf-8"))
        except Exception:
            data = {}

        user_msg = data.get("message", "").strip()
        history = data.get("history", [])

        if not user_msg:
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Message is required"}).encode("utf-8"))
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "close")
        self.end_headers()

        # Fast-path instant FAQ response
        fast_reply = get_instant_faq(user_msg)
        if fast_reply:
            chunk_obj = {"choices": [{"delta": {"content": fast_reply}}]}
            self.wfile.write(f"data: {json.dumps(chunk_obj, ensure_ascii=False)}\n\n".encode("utf-8"))
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
            return

        system_prompt = build_system_prompt()
        messages = [{"role": "system", "content": system_prompt}]
        for h in history[-4:]:
            role = "user" if h.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": h.get("text", "")})
        messages.append({"role": "user", "content": user_msg})

        streamed_any = False
        payload = {
            "model": PRIMARY_MODEL,
            "messages": messages,
            "stream": True,
            "max_tokens": 250,
            "temperature": 0.3
        }

        try:
            resp = HTTP_SESSION.post(
                NVIDIA_API_URL,
                json=payload,
                stream=True,
                timeout=3.5
            )

            if resp.status_code == 200:
                for line in resp.iter_lines():
                    if line:
                        decoded = line.decode("utf-8")
                        self.wfile.write(f"{decoded}\n\n".encode("utf-8"))
                        self.wfile.flush()
                        streamed_any = True
        except Exception:
            pass

        if not streamed_any:
            fallback_text = generate_dynamic_fallback(user_msg)
            chunk_obj = {"choices": [{"delta": {"content": fallback_text}}]}
            self.wfile.write(f"data: {json.dumps(chunk_obj, ensure_ascii=False)}\n\n".encode("utf-8"))
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
        else:
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
