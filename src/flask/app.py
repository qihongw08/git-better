from flask import Flask, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os
import re

load_dotenv()

key = os.getenv('GROQ_API_KEY')

client = Groq(api_key=key)

app = Flask(__name__)

print("- Define the `PrimeCheck` function to check if a number is prime\n- Initialize an empty array `primeArray` before the loop\n- In `PrimeCheck`, add the prime number to `primeArray` if it's prime\n- Skip even numbers after checking 2 by incrementing `i` by 1, then by 2\n- Add `i` to the array if it's prime\n\nHere's the corrected code:\n\n```javascript\nvar numPrimes = prompt(\"How many primes?\");\nvar primeArray = [];\n\nfunction PrimeCheck(i) {\n    if (i === 2) {\n        primeArray.push(i);\n        return;\n    }\n    if (i % 2 === 0) return;\n    for (var j = 3; j <= Math.sqrt(i); j += 2) {\n        if (i % j === 0) return;\n    }\n    primeArray.push(i);\n}\n\nfor (var i = 2; primeArray.length < numPrimes; i++) {\n    PrimeCheck(i);\n}\n```")


# @app.route("/")
# def init_ollama():
#     # do stuff here -- deepseek
#     return "<p>Hello, World!</p>"

# takes in prompt in body and returns response
@app.route("/prompt", methods=["GET"])
def prompt():
    code_snippet = request.json["code"]
    prompt = "Don't say anything else but a bullet list, how to fix this code snippet: " + code_snippet
    completion = client.chat.completions.create(
    model="deepseek-r1-distill-llama-70b",
    messages=[
        {"role": "user", "content": prompt}
    ],
    max_tokens=4096,
    temperature=0.6,
    top_p=1,
    stream=True
    )

    print("- Define the `PrimeCheck` function to check if a number is prime\n- Initialize an empty array `primeArray` before the loop\n- In `PrimeCheck`, add the prime number to `primeArray` if it's prime\n- Skip even numbers after checking 2 by incrementing `i` by 1, then by 2\n- Add `i` to the array if it's prime\n\nHere's the corrected code:\n\n```javascript\nvar numPrimes = prompt(\"How many primes?\");\nvar primeArray = [];\n\nfunction PrimeCheck(i) {\n    if (i === 2) {\n        primeArray.push(i);\n        return;\n    }\n    if (i % 2 === 0) return;\n    for (var j = 3; j <= Math.sqrt(i); j += 2) {\n        if (i % j === 0) return;\n    }\n    primeArray.push(i);\n}\n\nfor (var i = 2; primeArray.length < numPrimes; i++) {\n    PrimeCheck(i);\n}\n```")

    response_content = []

    for chunk in completion:
        delta_content = chunk.choices[0].delta.content
        if delta_content:
            response_content.append(delta_content)

    # Join response and clean unwanted tags
    response_text = "".join(response_content).strip()
    
    # Remove <think>...</think> blocks completely
    clean_response = re.sub(r"<think>.*?</think>", "", response_text, flags=re.DOTALL)

    return jsonify({"fixes": clean_response.strip()})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
