function least_squares(T, y, alpha)
{
    // https://en.wikipedia.org/wiki/Numerical_methods_for_linear_least_squares
    var m = ROWS(T), n = COLS(T), TH, THT, R, x;
    function vy(m) {return vec2col(y.length < m ? y.concat(array(m-y.length, O)) : y.slice(0, m));}

    //THT = add(mul(TH=ctranspose(T), T), eye(n, dot(alpha, alpha))),

    // this is instable and inefficient for ill-conditioned T
    //x = mul(inv(THT), mul(TH, vy(m)));

    // this is more stable when THT is well-conditioned but not very efficient
    //R = chol(THT, "upper");
    //x = R && R.length ? solve_tri("upper", R, solve_tri("lower", ctranspose(R), mul(TH, vy(m)))) : mul(TH, vy(m));

    // this is stable but does more computations than (*) below since it does not take advantage when T has toeplitz form
    R = qr(cat_vert(T, eye(n, alpha)), true);
    x = solve_tri("upper", R[1], mul(ctranspose(R[0]), vy(ROWS(R[0]))), 0, null, n);

    /*
    // (*) FAST INVERSE QR FACTORIZATION FOR TOEPLITZ MATRICES, JAMES G. NAGY, 1993
    var k, t0 = T[0][0],
        T0 = matrix(m-1, n-1, function(i, j) {return T[i+1][j+1];}),
        u = array(n-1, function(i) {return T[0][i+1];}),
        v = array(m-1, function(i) {return T[i+1][0];}),
        //uu = array(m-1, function(i) {return T[i][n-1];}),
        vv = array(n-1, function(i) {return T[m-1][i];}),
        Ti0 = array(m, function(i) {return T[i][0];}),
        y0 = dotdiv(Ti0, norm(Ti0)),
        y1 = array(y0.length, function(i) {return 0 === i ? I : O;}),
        y2 = array(y0.length, O),
        y3 = y0.map(function(yi) {return scalar_neg(yi);}),
        y0Y = mul(y0, y[0]),
        y1Y = mul(y1, y[0]),
        y2Y = y2,//mul(y2, y[0]),
        y3Y = mul(y3, y[0]),
        c = [y0Y, y1Y, y2Y, y3Y],
        r00 = null == alpha || eq(alpha, O) ? hypotn(array(m, function(i) {return T[i][i];})) : scalar_add(scalar_add(dot(t0, t0), dot(v, v)), dot(alpha, alpha)),
        lt, l1, l2, lb,
        h1, h2, h3,
        d = I, g1 = I, g2 = I,
        b, cs, sn,
        z = vec(div(add(mul(t0, u), mul(ctranspose(T0), vec2col(v))), r00)),
        rk, sk
    ;
    x = array(m, O);
    for (k=0; k<n; ++k)
    {
        // kth row of R^(-T) = rk
        if (0 === k)
        {
            h1 = [O];
            h2 = [O];
            h3 = [O];
            rk = [scalar_div(I, r00)];
        }
        else
        {
            h1.push(O);
            h2.push(O);
            h3.push(O);
            lt = rk;

            b = dot(lt, u.slice(0, k));
            [cs, sn] = compute_givens(d, scalar_neg(b));
            d = scalar_add(scalar_mul(cs, d), scalar_mul(sn, b));
            l1 = add(mul(cs, lt), mul(sn, h1));
            h1 = add(mul(scalar_neg(sn), lt), mul(cs, h1));

            b = dot(l1, vv.slice(0, k));
            [cs, sn] = compute_givens(g1, b, 'hyp');
            g1 = scalar_sub(scalar_mul(cs, g1), scalar_mul(sn, b));
            l2 = add(mul(cs, l1), mul(scalar_neg(sn), h2));
            h2 = add(mul(scalar_neg(sn), l1), mul(cs, h2));

            b = dot(l2, z.slice(0, k));
            [cs, sn] = compute_givens(g2, b, 'hyp');
            g2 = scalar_sub(scalar_mul(cs, g2), scalar_mul(sn, b));
            lb = add(mul(cs, l2), mul(scalar_neg(sn), h3));
            h3 = add(mul(scalar_neg(sn), l2), mul(cs, h3));

            rk = [scalar_neg(scalar_div(dot(lb, z.slice(0, k)), r00))].concat(lb);
        }

        // kth entry of Q(^T)B = sk
        // TODO
        if (0 === k)
        {
        }
        else
        {
        }

        // update x
        rk.forEach(function(rki, i) {x[i] = scalar_add(x[i], scalar_mul(rki, sk));});
    }*/
    return x;
}
function deconv(y, h, method, a, shape, want_r)
{
/*
% tests
y = [2 7 4 9];
h = [1 0 1];
[x,r] = deconv(y,h) % correct
%%
xin = [-1 2];
h = [2 5];
y = conv(xin,h,"valid")
[x,r] = deconv(y,h,"valid",Method="least-squares");
xin
x % differs from example -0.1724   -0.0690
%%
xin = [-1 2 3 -2 0 1 2];
h = [2 4 -1 1];
y = conv(xin,h,"same");
[x,r] = deconv(y,h,"same",Method="least-squares");
xin
x % correct
%%
N = 200;
n = 0.1*(1:N);
x = 2*exp(-0.5*((n-10)).^2);
h = 0.1*randn(1,length(x));
y = conv(x,h);
[x1,r1] = deconv(y,h);
[x2,r2] = deconv(y,h,Method="least-squares");
plot(n,x,Color="b",n,x1,Color="r")
plot(n,x,Color="b",n,x2,Color="g") % correct
*/
    if ("least-squares" === method)
    {
        // least squares with regularization
        var n = y.length, m = h.length, max = stdMath.max(n, m),
            offset = "same" === shape ? m >> 1 : ("valid" === shape ? m >> 1 : 0),
            x = vec(least_squares(matrix(max, "same" === shape ? n : ("valid" === shape ? (n+m-1) : (n-m+1)), function(i, j) {
                i += offset; return 0 <= i-j && i-j < m ? h[i-j] : O; // convolution has toeplitz matrix form
            }), y, a))
        ;
        return [x, want_r ? conv(x, h, shape).map(function(xhi, i) {return scalar_sub(y[i], xhi);}) : []];
    }
    else
    {
        // polynomial long-division
        return divp(y, h, true);
    }
}
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
        ans = deconv(y, h, "least-squares" === nv.Method ? "least-squares" : "long-division", nv.RegularizationFactor, shape, 1 < nargout);
    }
    return 1 < nargout ? ans : ans[0];
}, {
     Method: "long-division" // or "least-squares"
    ,RegularizationFactor: 0
}));
