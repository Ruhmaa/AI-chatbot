from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return Response(json.dumps({"error": "No message"}), status=400)

    def generate():
        try:
            # stream=True is the magic part!
            stream = ollama.chat(
                model='llama3',
                messages=[{'role': 'user', 'content': user_message}],
                stream=True,
            )
            
            for chunk in stream:
                content = chunk['message']['content']
                # Send the chunk as a small JSON string
                yield json.dumps({"reply": content}) + "\n"
                
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"

    return Response(stream_with_context(generate()), content_type='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)