from google import genai

from backend.app.config import settings

def list_available_models():
    if not settings.GOOGLE_API_KEY:
        print("GOOGLE_API_KEY not set")
        return
        
    print("Checking models for configured Google API key...")
    
    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        try:
            print("Available models:")
            for model in client.models.list():
                methods = (
                    getattr(model, "supported_generation_methods", None)
                    or getattr(model, "supported_actions", None)
                    or []
                )
                if not methods or any("generate" in str(method).lower() for method in methods):
                    print(f" - {model.name}")
        finally:
            client.close()
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_available_models()
