function intersect(x, y, ord, rows, nargout)
{
    if (!is_array(x) || !is_array(y)) not_supported("intersect");
    nargout = nargout || 1;
    x = colon(x);
    y = colon(y);
    var ans = [], found = {},
        ia = null, ib = null;
    x.forEach(function(v, i) {
        var k = String(v);
        if (!HAS.call(found, k))
        {
            found[k] = [i, -1];
        }
    });
    y.forEach(function(v, i) {
        var k = String(v);
        if (HAS.call(found, k))
        {
            found[k][1] = i;
            ans.push(v);
        }
    });
    if ("sorted" === ord) ans = sort(ans);
    if (1 < nargout)
    {
        ia = ans.map(function(v) {return found[String(v)][0] + 1;});
    }
    if (2 < nargout)
    {
        ib = ans.map(function(v) {return found[String(v)][1] + 1;});
    }
    return 1 < nargout ? [ans, ia, ib] : ans;
}
fn.intersect = varargout(function(nargout, x, y) {
    var ord = "sorted", rows = '', i = 3;
    if ("rows" === arguments[i]) rows = arguments[i++];
    if ("stable" === arguments[i] || "sorted" === arguments[i]) ord = arguments[i++];
    if ("rows" === arguments[i]) rows = 'rows';
    return intersect(x, y, ord, rows, nargout);
});
