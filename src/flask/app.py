from flask import Flask
import requests
import bs4
import ollama

app = Flask(__name__)

@app.route("/")
def init_ollama():
    # do stuff here -- deepseek
    return "<p>Hello, World!</p>"

@app.route("/query", methods=["GET"])
def query():
    query = request.args.get("query")
    if not query:
        return error_response("No query provided", 400)

    response = "PLACEHOLDER"

    response = ollama.generate(model="llama3.2", prompt=PROMPT)["response"]

    return jsonify({"response": response, "message": "Query successful"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
