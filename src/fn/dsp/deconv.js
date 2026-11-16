function deconv(y, h, method, a, shape)
{
    if ("least-squares" === method)
    {
        // TODO
        return [[], y];
    }
    else
    {
        // polynomial long-division
        return divp(y, h, true);
    }
}
fn.deconv = varargout(namevalueargs(function(nargout, y, h, shape) {
    var ans, nv = arguments[arguments.length-1];
    if (!is_string(shape)) shape = "full";
    if (is_scalar(y) || is_scalar(h))
    {
        ans = 1 < nargout ? [dotdiv(y, h), O] : dotdiv(y, h);
    }
    else
    {
        y = vec(y); h = vec(h);
        if (!is_vector(y) || !is_vector(h)) not_supported("deconv");
        if (!h.length || ((1 === h.length) && eq(h[0], O))) throw "deconv: divisor is zero";
        ans = deconv(y, h, "least-squares" === nv.Method ? "least-squares" : "long-division", _(nv.RegularizationFactor || 0), shape);
    }
    return 1 < nargout ? ans : ans[0];
}, {
     Method: "long-division" // or "least-squares"
    ,RegularizationFactor: 0
}));
