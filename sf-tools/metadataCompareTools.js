/*
    Compares 2 SObjects
    @source : {body: string, filename: string}
    @destination : {body: string, filename: string}
    @callback : function(error,result)
*/

var xml2js = require('xml2js');

exports.compareSObjects = function(source, destination, callback){


	parseXML(source.body, function(err, resultSource) {
		if (err) {
			return callback(err);
		}
		parseXML(destination.body, function(err, resultDest) {
			if (err) {
				return callback(err);
			}
			callback(null, diffObjects(resultSource, resultDest));
		});
	});

}

function parseXML(source, callback){
	var parser = new xml2js.Parser();

	parser.parseString(source, function (err, result) {
		if (err) {
			return callback(err);
		}
        return callback(null, result);
    });
	
	return;
}

function diffValues(src, dst) {
	if (src === dst) return false;
	if ((src !== null && (dst === null || dst === undefined)) || ((src === null || src === undefined) && dst !== null)) return true;
	return !(src.toString() === dst.toString());
}

function parsePropertyVal(propVal) {
	//var res = null;
	switch (typeof propVal) {
		case "string":
			switch (propVal.trim().toLowerCase()) {
				case "true":
					return true;
					break;
				case "false":
					return false;
					break;
				default:
					return propVal;
			}
			break;
		case "object":
			if (propVal instanceof Array) {
				switch (propVal.length) {
					case 0:
						return null;
					case 1:
						return parsePropertyVal(propVal[0]);
					default:
						if (typeof propVal[0] === "object") {
							if (propVal[0].hasOwnProperty("fullName") && propVal[0].hasOwnProperty("default")) {
								var res = { values: [], default: null };
								for (var i = 0; i < propVal.length; i++) {
									var valObj = propVal[i];
									res.values.push(parsePropertyVal(valObj.fullName));
									if (parsePropertyVal(valObj.default) === "true") res.default = parsePropertyVal(valObj.fullName);
								}
								return res;
							}
							else if (propVal){}
							else return propVal;
						}
				}
			}
			else if (propVal.hasOwnProperty("picklistValues")) {
				var subPropArrayName = "picklistValues";
				var values = [];
				var defaultVal = null;
				for (var i = 0; i < propVal[subPropArrayName].length; i++) {
					var valObj = propVal[subPropArrayName][i];
					values.push(parsePropertyVal(valObj.fullName));
					if (parsePropertyVal(valObj.default) === "true") defaultVal = parsePropertyVal(valObj.fullName);
				}
				if (propVal.hasOwnProperty("sorted")) {
					propVal.sorted = parsePropertyVal(propVal.sorted);
					if (propVal.sorted === true) propVal[subPropArrayName] = values;
					else propVal[subPropArrayName] = values.sort();
				}
				else {
					propVal[subPropArrayName] = values.sort();
				}
				propVal.default = defaultVal;
				return propVal;
			}
			else return propVal;
			break;
		default:
			return propVal;
	}
}

function createFieldProperty(propVal, from) {
	if (propVal === undefined || propVal === null) return null;
	var prop = { source: null, dest: null };
	var val = parsePropertyVal(propVal);
	if (from === "source") prop.source = val;
	else if (from === "dest") prop.dest = val;
	return prop;
}

function diffObjects(src, dst) {
	var result = {};

	var entityKeys = {
		fields: "fullName",
		actionOverrides: "actionName",
		businessProcesses: "fullName",
		listViews: "fullName",
		recordTypes: "fullName",
		validationRules: "fullName",
		webLinks: "fullName"
	}

	for (var entity in src.CustomObject) {
		if (!entityKeys.hasOwnProperty(entity)) continue;

		console.log("Analysing source "+entity);

		result[entity] = {};
		var key = entityKeys[entity];

		for (var i = 0; i < src.CustomObject[entity].length; i++) {
			var item = src.CustomObject[entity][i];
			console.log(entity+": "+item[key]);
			result[entity][item[key]] = {
				found: "source"
			};
			for (prop in item) {
				if (prop !== key) {
					result[entity][item[key]][prop] = createFieldProperty(item[prop], "source");
				}
			}
		};
	}

	for (var entity in dst.CustomObject) {
		if (!entityKeys.hasOwnProperty(entity)) continue;

		console.log("Analysing destination "+entity);

		if (!result.hasOwnProperty(entity)) result[entity] = {};
		var key = entityKeys[entity];

		for (var i = 0; i < dst.CustomObject[entity].length; i++) {
			var item = dst.CustomObject[entity][i];
			console.log(entity+": "+item[key]);
			if (result[entity][item[key]] === undefined) {
				result[entity][item[key]] = {
					found: "destination"
				};
				for (prop in item) {
					if (prop !== key) {
						result[entity][item[key]][prop] = createFieldProperty(item[prop], "dest");
					}
				}
			}
			else {
				var itemRes = result[entity][item[key]];
				itemRes.found = "both";
				for (prop in item) {
					if (prop !== key) {
						if (itemRes[prop] === undefined || itemRes[prop] === null) itemRes[prop] = createFieldProperty(item[prop], "dest");
						else itemRes[prop].dest = parsePropertyVal(item[prop]);
					}
				}
			}
		};
	}

	for (var entity in result) {
		console.log("Analysing "+entity+" differences");
		for (var itemKey in result[entity]) {
			var item = result[entity][itemKey];
			console.log(entity+": "+itemKey);
			for (prop in item) {
				item[prop].diff = diffValues(item[prop].source, item[prop].dest);
			}
		}
	}

	var jsonResult = JSON.stringify(result, undefined, 2);

	/*
	fs.writeFile("files\\diff.json", jsonResult, function(err) {
		if (err) throw err;
		console.log("Diff result has been written into the file files\\diff.json");
	});
	*/

	return jsonResult;
}