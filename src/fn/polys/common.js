function addp(p, q)
{
    // adapted from https://github.com/foo123/Abacus
    var i = p.length-1, j = q.length-1, pq = [];
    while ((0 <= i) && (0 <= j)) pq.unshift(scalar_add(p[i--], q[j--]));
    while (0 <= i) pq.unshift(p[i--]);
    while (0 <= j) pq.unshift(q[j--]);
    return pq;
}
var mulp = conv, divp = deconv;
function horner(p, x)
{
    // adapted from https://github.com/foo123/Abacus
    var O = __(0);
    if (!p.length) return O;
    x = x || O;
    var n = p.length, i = 0, v = p[0];
    while (i+1 < n)
    {
        ++i;
        v = scalar_add(scalar_mul(v, x), p[i]);
    }
    return v;
}
