fn.strsplit = varargout(namevalueargs(function(nargout, str, delim) {
    if (!is_string(str)) not_supported("strsplit");
    var nv = nv = arguments[arguments.length-1];
    if (null == delim)
    {
        delim = new RegExp('[ \\f\\n\\r\\t\\v]'+(_(nv.CollapseDelimiters) ? '+' : ''), 'g');
    }
    else
    {
        delim = new RegExp('(' + vec(delim).map(function(delim) {
            return 'RegularExpression' === nv.DelimiterType ? String(delim) : (' ' === delim ? '[ \\f\\n\\r\\t\\v]' : RegExp.escape(String(delim)));
        }).join('|') + ')'+(_(nv.CollapseDelimiters) ? '+' : ''), 'g');
    }
    var m, start = 0, splits = [], matches = 1 < nargout ? [] : null, ans;
    while (null !== (m=delim.exec(str)))
    {
        if (1 < nargout) matches.push(m[0]);
        splits.push(str.slice(start, m.index));
        start = m.index + m[0].length;
        if (!m[0].length) ++delim.lastIndex;
    }
    splits.push(str.slice(start));
    ans = 1 < nargout ? [splits, matches] : splits;
    //ans = str.split(delim);
    return ans;
}, {
    CollapseDelimiters: 1,
    DelimiterType: 'Simple'
}));
// TODO
fn.split = fn.strsplit;
