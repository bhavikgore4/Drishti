import sys
import traceback

try:
    print("Attempting to import app.main module...")
    import app.main
    print("app.main imported successfully")
    print("Attributes in app.main:", dir(app.main))
    
    if hasattr(app.main, 'app'):
        print("app found!")
    else:
        print("ERROR: 'app' not found in app.main")
        
except Exception as e:
    print("Error during import:")
    traceback.print_exc()
