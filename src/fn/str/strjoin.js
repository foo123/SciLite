fn.strjoin = function(str, delim) {
    delim = delim || " ";
    delim = vec(delim);
    str = vec(str);
    var n = str.length, m = delim.length, j = 0;
    if (1 !== m && 1 < n && n > m+1) throw "strjoin: delimiter array length must be at least str array length minus one";
    return str.reduce(function(joined, s, i) {
        return joined + String(s) + (i+1 < n ? String(delim[(j++) % m]) : "");
    }, "");
};
// TODO
fn.join = fn.strjoin;
