fn.polydiv = varargout(function(nargout, a, b) {
    var ans;
    if (is_scalar(a) || is_scalar(b))
    {
        ans = 1 < nargout ? [dotdiv(a, b), O] : dotdiv(a, b);
    }
    else
    {
        a = vec(a);
        b = vec(b);
        if (!is_vector(a) || !is_vector(b)) not_supported("polydiv");
        if (!b.length || (1 === b.length) && eq(b[0], O)) throw "polydiv: divisor is zero";
        ans = divp(a, b, false);
    }
    return 1 < nargout ? ans : ans[0];
});
