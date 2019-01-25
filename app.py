from flask import Flask, render_template, jsonify, request
import json
import records

app = Flask(__name__)


@app.route("/", methods = ['POST', 'GET'])
def index():
    if(request.method == 'POST'):
      print(request.form['tit']);
      return "saved"
    else:
      return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)