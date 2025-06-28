from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/hook', methods=['POST'])
def webhook():
    print("Webhook received!")
    subprocess.run(["docker", "pull", "xming673/vcards:latest"])
    subprocess.run(["docker", "stop", "vCard"])
    subprocess.run(["docker", "rm", "vCard"])
    subprocess.run([
        "docker", "run", "-d", "--name", "vCard",
        "xming673/vcards:latest"
    ])
    return "OK", 200

app.run(host='0.0.0.0', port=8000)
