let keyword = {
  generateKeywords: function(text) {
    text = text.toLowerCase();
    let all = text.split(" ");
    let result = [];
    for (let word of all) {
      let editText = word + " " + text.replace(word, "");
      result = [...this.edit(editText.replace("  ", " ")), ...result];
    }
    return result;
  },
  edit: function(text) {
    let arr = [];
    let str = "";
    text.split("").forEach(letter => {
      str += letter;
      arr.push(str);
    });
    return arr;
  }
};

export default keyword;
