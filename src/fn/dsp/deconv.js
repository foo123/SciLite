function deconv(y, h, method, a, shape)
{
    if ("least-squares" === method)
    {
        // least squares with regularization
        var n = y.length, m = h.length,
            i0 = "same" === shape ? m >> 1 : ("valid" === shape ? m : 0),
            // ny = nx+m-1 => nx=ny-m+1
            H = matrix(n, "same" === shape ? n : ("valid" === shape ? (n+m-1) : (n-m+1)), function(i, j) {
                i += i0; return 0 <= i-j && i-j < m ? h[i-j] : O;
            }),
            HT = ctranspose(H)
        ;
        // this is unstable for ill-conditioned H
        return [x=vec(mul(mul(inv(add(mul(HT, H), mul(eye(ROWS(HT)), a))), HT), vec2col(y))), addp(y, conv(x, h, shape), 'sub')];
    }
    else
    {
        // polynomial long-division
        return divp(y, h, true);
    }
}
/*
% tests
xin = [-1 2 3 -2 0 1 2];
h = [2 4 -1 1];
y = conv(xin,h,"same");
[x,r] = deconv(y,h,"same",Method="least-squares");
xin
x
%%
xin = [-1 2];
h = [2 5];
y = conv(xin,h,"valid")
[x,r] = deconv(y,h,"valid",Method="least-squares");
xin
x
%%
N = 200;
n = 0.1*(1:N);
x = 2*exp(-0.5*((n-10)).^2);
h = 0.1*randn(1,length(x));
y = conv(x,h);
[x1,r1] = deconv(y,h);
[x2,r2] = deconv(y,h,Method="least-squares");
plot(n,x,n,x1,n,x2)
*/
fn.deconv = varargout(namevalueargs(function(nargout, y, h, shape) {
    var ans, nv = arguments[arguments.length-1]._;
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
