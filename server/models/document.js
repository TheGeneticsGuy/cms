const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   url: { type: String },
   description: { type: String },
   children: [{ id: String, name: String, url: String }]
});

module.exports = mongoose.model('Document', documentSchema);