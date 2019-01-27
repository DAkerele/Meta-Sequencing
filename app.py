from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:Da010700@localhost:3306/Sequencing"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

IDECS = {
	"A":"AATC",
	"B":"ACTG",
	"C":"AGGC",
	"D":"ATAT",
	"E":"AGTG",
	"F":"GTCA",
	"G":"CTGA",
	"H":"TTTC",
	"1":"agtt",
	"2":"cggg",
	"3":"gctg",
	"4":"gttc",
	"5":"aaag",
	"6":"aagg",
	"7":"actt",
	"8":"atgg",
	"9":"ctca",
	"10":"ctaa",
	"11":"ttca",
	"12":"gtaa",
}

class Pools(db.Model):
	__tablename__ = "pools"
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	track_num = db.Column(db.Integer,nullable=False)
	date_created = db.Column(db.String(120), nullable=False)
	illum = db.Column(db.String(120), nullable=False)
	wells = db.relationship('Wells', backref='pools', lazy=True)


class Wells(db.Model):
	__tablename__ = "wells"
	id = db.Column(db.Integer, primary_key=True)
	request_id = db.Column(db.Integer,  nullable=False)
	pool_id =  db.Column(db.Integer, db.ForeignKey('pools.id'),nullable=False)
	well_loc = db.Column(db.String(120),  nullable=False)
	ind_1 = db.Column(db.String(120),  nullable=False)
	ind_2 = db.Column(db.String(120),  nullable=False)
	samp_count = db.Column(db.Integer,  nullable=False)
	amplicon = db.Column(db.String(120),  nullable=False)
	 
class Request(db.Model):
	__tablename__ = "requests"
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(120), nullable=False)
	name = db.Column(db.String(120), nullable=False)
	amplicon = db.Column(db.String(120) , nullable=False)
	date = db.Column(db.String(120), nullable=False)
	status = db.Column(db.String(120),nullable=False, default = "pending")
	samples = db.relationship('Samples', backref='requests', lazy=True)

class Samples(db.Model):
	__tablename__ = "samples"
	id = db.Column(db.Integer, primary_key=True)
	samp_id = db.Column(db.String(80), nullable = False)
	name = db.Column(db.String(80), nullable=False)
	loc = db.Column(db.String(120),  nullable=False)
	des = db.Column(db.String(120),nullable=False)
	req_id = db.Column(db.Integer, db.ForeignKey('requests.id'),nullable=False)


db.create_all()


@app.route("/", methods = ['POST', 'GET'])
def index():
    return render_template('submit.html')

@app.route('/submit', methods = ['POST', 'GET'])
def submit():
	if(request.method == 'POST'):
		return render_template('index.html', data = request.form)
	return render_template('submit.html')

@app.route('/success', methods = ['POST', 'GET'])
def success():
	if(request.method == "POST"):
		data = request.get_json()
		req = add_request(data['req_data'])
		for row in data['data']:
			add_samples(row,req.id)
		return "Request Submitted"
	return render_template("submit.html")

@app.route("/load", methods = ['GET'])
def load():
	req_id = request.args.get('id')
	selected= db.session.query(Samples).filter_by(req_id=req_id).all()
	samp_data = []
	for row in selected:
		samp_data.append([row.samp_id,row.name,row.loc,row.des])

	return render_template('load.html', data = samp_data)


@app.route('/update', methods = ['POST'])
def update():
	data = request.get_json()
	print(data)
	
	data_request = db.session.query(Request).filter_by(id = data['id']).first()
	db.session.query(Samples).filter_by(req_id = data['id']).delete()
	for row in data['data']:
		data_request.samples.append(Samples(samp_id = row[0], name = row[1], loc = row[2], des = row[3], req_id = data['id']))
	
	db.session.commit()
	return "Entry Updated"


@app.route('/pool', methods = ['GET'])
def pool():
	return render_template('pools.html')

@app.route('/pool/submit', methods = ['POST', 'GET'])
def pool_submit():
	if(request.method == 'POST'):
		return render_template('wells.html', data = request.form)
	return render_template('pools.html')

@app.route('/pool/success', methods = ['POST', 'GET'])
def pool_success():
	if(request.method == "POST"):
		data = request.get_json()
		pool = add_pool(data['pool_data'])
		for row in data['well_data']:
			add_wells(row,pool.id)
		return "Request Submitted"
	return render_template("submit.html")

	
def add_request(req):
	req_entry = Request(email = req['email'], name = req['tit'], amplicon = req["amp"], date = req['date'])
	db.session.add(req_entry)
	db.session.commit()
	return req_entry

def add_samples(samples,req_id):
	samp_entry = Samples(samp_id = samples[0], name = samples[1], loc = samples[2], des = samples[3], req_id = req_id)
	db.session.add(samp_entry)
	db.session.commit()
	return samp_entry

def add_pool(pool):
	pool_entry = Pools(name = pool['name'], track_num = pool['track_num'], date_created = pool["date"], illum = pool['ill'])
	db.session.add(pool_entry)
	db.session.commit()
	return pool_entry


def add_wells(well,pool_id):
	well_entry = Wells(request_id = well[0], 
		pool_id = well[0], 
		well_loc = well[1], 
		ind_1 = IDECS[well[1][0]], 
		ind_2 = IDECS[well[1][1]] , 
		samp_count = db.session.query(Samples).filter_by(req_id = well[0]).count(), 
		amplicon = well[2])
	db.session.add(well_entry)
	db.session.commit()
	return well_entry


if __name__ == "__main__":
    app.run(debug=True)