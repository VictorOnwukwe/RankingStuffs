let votes = {};

votes.getVotes = function() {
  let votes = localStorage.getItem("votes")
    ? JSON.parse(localStorage.getItem("votes"))
    : [];
  return votes;
};

votes.addVote = function(payload) {
  let newVotes = votes.getVotes();
  newVotes.push(payload);
  localStorage.setItem("votes", JSON.stringify(newVotes));
};

module.exports = votes;
