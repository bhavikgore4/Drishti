import sys

# Add instrumentation to see what's happening
sys.path.insert(0, '.')

# Read and execute app/main.py directly with error handling
with open('app/main.py', 'r') as f:
    code = f.read()

print("Code to execute:")
print("=" * 50)
print(code)
print("=" * 50)

try:
    exec(code)
    print("\nExecution successful!")
except Exception as e:
    print(f"\nExecution failed with error: {e}")
    import traceback
    traceback.print_exc()
