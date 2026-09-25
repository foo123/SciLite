function unique(x, ord, occ, rows, nargout)
{
    if (!is_array(x)) not_supported("unique");
    nargout = nargout || 1;
    x = colon(x);
    var ans = [], found = {},
        ia = null, ic = null;
    x.forEach(function(v, i) {
        var k = String(v);
        if (HAS.call(found, k))
        {
            found[k][1] = i;
        }
        else
        {
            found[k] = [i, i];
            ans.push(v);
        }
    });
    if ("sorted" === ord) ans = sort(ans);
    if (1 < nargout)
    {
        ia = ans.map(function(v) {return found[String(v)]["last" === occ ? 1 : 0] + 1;});
    }
    if (2 < nargout)
    {
        found = ans.map(function(v) {return String(v);});
        ic = x.map(function(v) {return found["last" === occ ? 'lastIndexOf' : 'indexOf'](String(v)) + 1;});
    }
    return 1 < nargout ? [ans, ia, ic] : ans;
}
function uniquetol(x, tol, occ, rows, nargout)
{
    if (!is_array(x)) not_supported("uniquetol");
    if (null == tol) tol = 1e-12;
    nargout = nargout || 1;
    tol = __(scalar_abs(tol));
    x = colon(x);
    var ans = [],
        ia = 1 < nargout ? [] : null,
        ic = 2 < nargout ? new Array(x.length) : null,
        xx = is_real(x) ? x : abs(x),
        t = n_mul(tol, max(abs(x))),
        m_x, m_i;

    for (;;)
    {
        m_i = 0;
        m_x = x.reduce("highest" === occ ? function(m_x, xi, i) {
            if (null != xi)
            {
                if ((null == m_x) || n_gt(xx[i], m_x))
                {
                    m_x = xi;
                    m_i = i;
                }
            }
            return m_x;
        } : function(m_x, xi, i) {
            if (null != xi)
            {
                if ((null == m_x) || n_lt(xx[i], m_x))
                {
                    m_x = xi;
                    m_i = i;
                }
            }
            return m_x;
        }, null);

        if (null == m_x) break;

        ans.push(m_x);
        if (ia) ia.push(m_i+1);
        x = x.map(function(xi, i) {
            if ((null != xi) && n_le(scalar_abs(scalar_sub(xi, m_x)), t))
            {
                if (ic) ic[i] = ans.length;
                return null;
            }
            return xi;
        });
    }
    return 1 < nargout ? [ans, ia, ic] : ans;
}
fn.unique = varargout(function(nargout, x) {
    var ord = "sorted", occ = "first", rows = '', i = 2;
    if ("stable" === arguments[i] || "sorted" === arguments[i]) ord = arguments[i++];
    if ("first" === arguments[i] || "last" === arguments[i]) occ = arguments[i++];
    //if ("rows" === arguments[i]) rows = 'rows';
    return unique(x, ord, occ, rows, nargout);
});
fn.uniquetol = varargout(function(nargout, x) {
    var tol = 1e-12, occ = "lowest", rows = '', i = 2;
    if (is_scalar(arguments[i])) tol = real(arguments[i++]);
    if ("lowest" === arguments[i] || "highest" === arguments[i]) occ = arguments[i++];
    //if ("rows" === arguments[i]) rows = 'rows';
    return uniquetol(x, tol, occ, rows, nargout);
});
