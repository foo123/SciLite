function deconv(n, d, pad)
{
    // adapted from https://github.com/foo123/Abacus
    // polynomial division
    var q = [], r = n.slice(),
        diff = r.length - d.length,
        diff0, d0 = d;
    if (0 <= diff)
    {
        q = array(diff+1, 0);
        while (0 <= diff)
        {
            diff0 = diff;
            d = d0.concat(array(diff, 0));
            q[q.length-1-diff] = scalar_div(r[0], d[0]);
            r = addp(r, mulp(d, [scalar_neg(q[q.length-1-diff])]));
            while (r.length && eq(r[0], 0)) r.shift();
            diff = r.length - d0.length;
            if (diff === diff0) break; // remainder won't change anymore
        }
        //q = q.reverse();
    }
    return [q, pad ? (array(n.length-r.length, 0).concat(r)) : r];
}
fn.deconv = varargout(function(nargout, a, b) {
    var ans;
    if (is_scalar(a) || is_scalar(b))
    {
        ans = 1 < nargout ? [dotdiv(a, b), __(0)] : dotdiv(a, b);
    }
    else
    {
        a = vec(a);
        b = vec(b);
        if (!is_vector(a) || !is_vector(b)) not_supported("deconv");
        if (!b.length || (1 === b.length) && eq(b[0], 0)) throw "deconv: divisor is zero";
        ans = deconv(a, b, true);
    }
    return 1 < nargout ? ans : ans[0];
});
