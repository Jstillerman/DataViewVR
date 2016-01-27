var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NcFileSchema = new Schema({
  title: String,
  uploader: String,
  desc: String,
  loc: String,
  jsonloc: String
});

NcFileSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

NcFileSchema.methods.getInfo = function(){
	return {
		id: this._id,
		title: this.title,
		uploader: this.uploader,
		desc: this.desc,
		loc: this.loc,
		jsonloc: this.jsonloc,
		date: this.date
	};
};

NcFileSchema.methods.getOverview = function(){
	return {
		title: this.title,
		uploader: this.uploader,
		date: this.date
	};
};

NcFileSchema.methods.getURL = function(){
	return "/entry/" + this._id;
};

mongoose.model('NcFile', NcFileSchema);