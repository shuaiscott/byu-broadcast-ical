module.exports = {
  dedup: function(arr) {
    return arr.reduce(
      function(p, c) {
        // create an identifying id from the object values
        var id = c.nid;

        // if the id is not found in the temp array
        // add the object to the output array
        // and add the key to the temp array
        if (p.temp.indexOf(id) === -1) {
          p.out.push(c);
          p.temp.push(id);
        }
        return p;

        // return the deduped array
      },
      {
        temp: [],
        out: []
      }
    ).out;
  }
};
