"""Generate luxury water bottle product photography via Gemini Nano Banana.

Run from /app/backend with:  python -m generate_bottles
"""
import asyncio
import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()
API_KEY = os.environ["EMERGENT_LLM_KEY"]
OUT_DIR = Path("/app/frontend/public/bottles")
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE = (
    "Ultra-premium luxury product photography, single PET water bottle 300ml, "
    "tall slim transparent body, BLACK plastic cap, professional studio lighting, "
    "rich deep forest green background (#0B3D2E) with subtle golden vignette, "
    "extreme detail, photorealistic, 8k, soft shadow, glossy reflection on bottle, "
    "centered composition, sharp focus on the bottle label. The label is wrapped "
    "around the bottle, premium matte finish with gold foil accents. No people, no text "
    "outside the label, no extra props. Bottle clearly the hero of the frame. "
)

PROMPTS = {
    "wedding": "Custom wedding water bottle. Label features elegant cursive script "
        "'Aishwarya & Rohan' in luxury gold foil over a cream background with a delicate "
        "floral monogram border. Wedding edition. " + BASE,

    "catering": "Custom catering branded water bottle. Label features the elegant brand mark "
        "'Royal Catering Co.' in gold foil serif typography on cream background with thin "
        "gold border frame. Premium banquet edition. " + BASE,

    "corporate": "Custom corporate branded water bottle. Label features a minimalist gold "
        "company logo monogram and clean uppercase brand name 'KERALA SPICES CO.' in a "
        "premium dark green and gold corporate brand identity. Boardroom edition. " + BASE,

    "religious": "Custom religious event water bottle. Label features a delicate gold cross "
        "icon and elegant serif text 'Holy Communion' in gold over cream background, "
        "with a subtle laurel border. Sacred edition. " + BASE,

    "restaurant": "Custom restaurant private label water bottle. Label features a hand-drawn "
        "gold restaurant crest with 'Meera Fine Dining' in luxury serif typography over "
        "deep cream background. Private label restaurant edition. " + BASE,

    "political": "Custom social event water bottle. Label features clean modern serif "
        "typography 'Annual Convention 2026' in gold on cream background with thin gold "
        "border. Distinguished political event edition. " + BASE,

    "funeral": "Custom memorial service water bottle. Label features a serene gold dove icon "
        "and elegant gold serif text 'In Loving Memory' on warm cream background, soft "
        "respectful design. Funeral service edition. " + BASE,

    "housewarming": "Custom housewarming celebration water bottle. Label features 'Welcome "
        "Home' in luxury gold serif script over cream background with a delicate gold "
        "house silhouette icon. Housewarming edition. " + BASE,
}


async def gen_one(key: str, prompt: str) -> None:
    out = OUT_DIR / f"{key}.png"
    if out.exists():
        print(f"[skip] {out.name} exists")
        return
    chat = LlmChat(api_key=API_KEY, session_id=f"bottle-{key}", system_message="You are a premium product photographer.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    try:
        _text, images = await chat.send_message_multimodal_response(msg)
    except Exception as e:
        print(f"[fail] {key}: {e}")
        return
    if not images:
        print(f"[empty] {key}")
        return
    data = base64.b64decode(images[0]["data"])
    out.write_bytes(data)
    print(f"[ok] {out.name}  ({len(data) // 1024} KB)")


async def main():
    # Run sequentially to be friendly to rate limits
    for k, p in PROMPTS.items():
        await gen_one(k, p)


if __name__ == "__main__":
    asyncio.run(main())
