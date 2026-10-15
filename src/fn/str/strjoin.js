fn.strjoin = function(str, delim) {
    delim = delim || " ";
    delim = vec(delim);
    str = vec(str);
    var n = str.length, m = delim.length;
    return str.reduce(function(joined, s, i) {
        return joined + String(s) + (i+1 < n ? String(delim[i % m]) : "");
    }, "");
};
// TODO
fn.join = fn.strjoin;
