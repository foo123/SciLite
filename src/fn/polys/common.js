// adapted from https://github.com/foo123/Abacus
function addp(p, q, do_sub)
{
    // polynomial addition/subtraction
    var i = p.length-1, j = q.length-1, pq = [];
    do_sub = 'sub' === do_sub;
    for (;(0 <= i) && (0 <= j);) pq.unshift(do_sub ? scalar_sub(p[i--], q[j--]) : scalar_add(p[i--], q[j--]));
    for (;0 <= i;) pq.unshift(p[i--]);
    for (;0 <= j;) pq.unshift(do_sub ? scalar_neg(q[j--]) : q[j--]);
    for (;pq.length && eq(pq[0], O);) pq.shift();
    return pq;
}
function mulp(p, q)
{
    // polynomial multiplication
    var i, j, n = p.length, m = q.length, nm = n + m - 1, pq = array(nm, O);
    for (i=0; i<n; ++i)
    {
        for (j=0; j<m; ++j)
        {
            pq[i+j] = scalar_add(scalar_mul(p[i], q[j]), pq[i+j]);
        }
    }
    /*pq = array(nm, function(i) {
        var j, jn, ij, pqi = O;
        for (j=0,jn=stdMath.min(i+1, n); j<jn; ++j)
        {
            ij = i-j;
            if ((0 <= ij) && (ij < m))
            {
                pqi = scalar_add(pqi, scalar_mul(p[j], q[ij]));
            }
        }
        return pqi;
    });*/
    for (;pq.length && eq(pq[0], O);) pq.shift();
    return pq;
}
function divp(n, d, pad)
{
    // polynomial long-division
    var q = [], r = n.slice(), diff = r.length - d.length, diff0, d0 = d;
    if (0 <= diff)
    {
        q = array(diff+1, O);
        for (;0 <= diff;)
        {
            diff0 = diff;
            d = d0.concat(array(diff, O));
            q[q.length-1-diff] = scalar_div(r[0], d[0]);
            r = addp(r, mulp(d, [scalar_neg(q[q.length-1-diff])]));
            for (;r.length && eq(r[0], O);) r.shift();
            diff = r.length - d0.length;
            if (diff === diff0) break; // remainder won't change anymore
        }
    }
    return [q, pad ? (array(n.length-r.length, O).concat(r)) : r];
}
function horner(p, x)
{
    if (!p.length) return O;
    x = x || O;
    var n = p.length, i = 0, v = p[0];
    for (;i+1 < n;) {++i; v = scalar_add(scalar_mul(v, x), p[i]);}
    return v;
}
