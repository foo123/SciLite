fn.strsplit = varargout(function(nargout, str, delim) {
    if (!is_string(str)) not_supported("strsplit");
    if (null == delim)
    {
        delim = new RegExp('[ \\f\\n\\r\\t\\v]+', 'g');
    }
    else
    {
        delim = new RegExp('(' + vec(delim).map(function(delim) {
            return ' ' === delim ? '[ \\f\\n\\r\\t\\v]' : RegExp.escape(delim);
        }).join('|') + ')+', 'g');
    }
    var m, start = 0, splits = [], matches = 1 < nargout ? [] : null, ans;
    while (null !== (m=delim.exec(str)))
    {
        if (1 < nargout) matches.push(m[0]);
        splits.push(str.slice(start, m.index));
        start = m.index + (m[0].length || 1);
        if (!m[0].length) ++delim.lastIndex;
    }
    splits.push(str.slice(start));
    ans = 1 < nargout ? [splits, matches] : splits;
    //ans = str.split(delim);
    return ans;
});
// TODO
fn.split = fn.strsplit;
