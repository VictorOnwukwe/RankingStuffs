

module.exports.destructureID = function(id) {
  return id.replace(/zzsl/g, "/").replace(/-/g, " ");
}