function svd(A, eta, wantu, wantv)
{
    /* adapted from:
    Peter Businger, Gene Golub,
    Algorithm 358:
    Singular Value Decomposition of a Complex Matrix,
    Communications of the ACM,
    Volume 12, Number 10, October 1969, pages 564-565.
    https://github.com/johannesgerer/jburkardt-f77/blob/master/toms358/toms358.f
    */
    // produces some columns with reflected signs from Octave's svd
    if (!is_num(eta)) eta = eps;
    eta = __(eta)
    var n = COLS(A), m = ROWS(A), svdT;

    if (m < n)
    {
        // compute transpose svd and return transpose result
        svdT = svd(transpose(A), eta, wantv, wantu);
        return wantu && wantv ? [transpose(svdT[2]), svdT[1], transpose(svdT[0])] : (wantu || wantv ? [transpose(svdT[0]), svdT[1]] : svdT);
    }

    var nu = wantu ? m : 0,
        nv = wantv ? n : 0,
        p = 0,
        a = copy(A),
        u = nu ? zeros(m, nu) : null,
        s = array(n, O),
        v = nv ? zeros(n, nv) : null,
        tol = n_div(constant.realmin, eta),
        x, y, z, w, q,
        e, r, g, f, h, sn, cs,
        i, j, k, l,
        kk, k1, l1, ll,
        iter, max_iter = 100,
        b = new Array(n),
        c = new Array(n),
        t = new Array(n),
        goto_240;

    // complex a
    // complex u
    // complex v
    // complex q
    // complex r
    // real sn
    // real cs
    // real b
    // real c
    // real f
    // real g
    // real h
    // real s
    // real t
    // real w
    // real x
    // real y
    // real z
    //
    //  Householder reduction.
    //
    c[1-1] = O;
    for (k=1; k<=n; ++k)
    {
        //10    continue
        k1 = k + 1;
        //
        //  Elimination of A(I,K), I = K+1, ..., M.
        //
        z = O;
        for (i=k; i<=m; ++i)
        {
            z = n_add(z, n_add(n_pow(real(a[i-1][k-1]), two), n_pow(imag(a[i-1][k-1]), two)));
        }

        b[k-1] = O;

        if (n_gt(z, tol))
        {
            z = realMath.sqrt(z);
            b[k-1] = z;
            w = scalar_abs(a[k-1][k-1]);

            if (n_eq(w, O))
            {
                q = I;
            }
            else
            {
                q = scalar_div(a[k-1][k-1], w);
            }

            a[k-1][k-1] = scalar_mul(q, n_add(z, w));

            if (k !== n+p)
            {
                for (j=k1; j<=n+p; ++j)
                {
                    q = O;
                    for (i=k; i<=m; ++i)
                    {
                        q = scalar_add(q, scalar_mul(scalar_conj(a[i-1][k-1]), a[i-1][j-1]));
                    }
                    q = scalar_div(q, n_mul(z, n_add(z, w)));
                    for (i=k; i<=m; ++i)
                    {
                        a[i-1][j-1] = scalar_sub(a[i-1][j-1], scalar_mul(q, a[i-1][k-1]));
                    }
                }

                //
                //  Phase transformation.
                //
                q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k-1])));
                for (j=k1; j<=n+p; ++j)
                {
                    a[k-1][j-1] = scalar_mul(q, a[k-1][j-1]);
                }
            }
        }

        //
        //  Elimination of A(K,J), J = K+2, ..., N
        //
        if (k === n)
        {
            //go to 140
            break;
        }

        z = O;
        for (j=k1; j<=n; ++j)
        {
            z = n_add(z, n_add(n_pow(real(a[k-1][j-1]), two), n_pow(imag(a[k-1][j-1]), two)));
        }

        c[k1-1] = O;

        if (n_gt(z, tol))
        {
            z = realMath.sqrt(z);
            c[k1-1] = z;
            w = scalar_abs(a[k-1][k1-1]);

            if (n_eq(w, O))
            {
                q = I;
            }
            else
            {
                q = scalar_div(a[k-1][k1-1], w);
            }

            a[k-1][k1-1] = scalar_mul(q, n_add(z, w));

            for (i=k1; i<=m; ++i)
            {
                q = O;
                for (j=k1; j<=n; ++j)
                {
                    q = scalar_add(q, scalar_mul(scalar_conj(a[k-1][j-1]), a[i-1][j-1]));
                }
                q = scalar_div(q, n_mul(z, n_add(z, w)));
                for (j=k1; j<=n; ++j)
                {
                    a[i-1][j-1] = scalar_sub(a[i-1][j-1], scalar_mul(q, a[k-1][j-1]));
                }
            }

            //
            //  Phase transformation.
            //
            q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k1-1])));
            for (i=k1; i<=m; ++i)
            {
                a[i-1][k1-1] = scalar_mul(a[i-1][k1-1], q);
            }
        }

        //k = k1;
        //go to 10
    }

    //
    //  Tolerance for negligible elements.
    //
    //140   continue
    e = O;
    for (k=1; k<=n; ++k)
    {
        s[k-1] = b[k-1];
        t[k-1] = c[k-1];
        e = max([e, n_add(s[k-1], t[k-1])]);
    }

    e = n_mul(eta, e);

    //
    //  Initialization of U and V.
    //
    if (0 < nu)
    {
        for (j=1; j<=nu; ++j)
        {
            u[j-1][j-1] = I;
        }
    }

    if (0 < nv)
    {
        for (j=1; j<=nv; ++j)
        {
            v[j-1][j-1] = I;
        }
    }

    //
    //  QR diagonalization.
    //
    for (kk=1; kk<=n; ++kk)
    {
        k = n + 1 - kk;
        //
        //  Test for split.
        //
        for (iter=1; iter<=max_iter; ++iter)
        {
            //220     continue
            goto_240 = true;
            for (ll=1; ll<=k; ++ll)
            {
                l = k + 1 - ll;
                if (n_le(realMath.abs(t[l-1]), e))
                {
                    //go to 290
                    goto_240 = false;
                    break;
                }
                if (n_le(realMath.abs(s[l-1-1]), e))
                {
                    //go to 240
                    goto_240 = true;
                    break;
                }
            }

            //
            //  Cancellation of E(L).
            //
            if (goto_240)
            {
                //240     continue
                cs = O;
                sn = I;
                l1 = l - 1;

                for (i=l; i<=k; ++k)
                {
                    f = n_mul(sn, t[i-1]);
                    t[i-1] = n_mul(cs, t[i-1]);

                    if (n_le(realMath.abs(f), e))
                    {
                        //go to 290
                        break;
                    }

                    h = s[i-1];
                    w = n_hypot(f, h);
                    s[i-1] = w;
                    cs = n_div(h, w);
                    sn = n_neg(n_div(f, w));

                    if (0 < nu)
                    {
                        for (j=1; j<=n; ++j)
                        {
                            x = real(u[j-1][l1-1]);
                            y = real(u[j-1][i-1]);
                            u[j-1][l1-1] = n_add(n_mul(x, cs), n_mul(y, sn));
                            u[j-1][i-1]  = n_sub(n_mul(y, cs), n_mul(x, sn));
                        }
                    }

                    if (0 < p)
                    {
                        for (j=n+1; j<=n+p; ++j)
                        {
                            q = a[l1-1][j-1];
                            r = a[i-1][j-1];
                            a[l1-1][j-1] = scalar_add(scalar_mul(q, cs), scalar_mul(r, sn));
                            a[i-1][j-1]  = scalar_sub(scalar_mul(r, cs), scalar_mul(q, sn));
                        }
                    }
                }
            }

            //
            //  Test for convergence.
            //
            //290     continue
            w = s[k-1];

            if (l === k)
            {
                //go to 360
                break;
            }

            //
            //  Origin shift.
            //
            x = s[l-1];
            y = s[k-1-1];
            g = t[k-1-1];
            h = t[k-1];
            f = n_div(n_add(n_mul(n_sub(y, w), n_add(y, w)), n_mul(n_sub(g, h), n_add(g, h))), n_mul(two, n_mul(h, y)));
            g = n_hypot(f, I);
            if (n_lt(f, O))
            {
                g = n_neg(g);
            }
            f = n_div(n_add(n_mul(n_sub(x, w), n_add(x, w)), n_mul(n_sub(n_div(y, n_add(f, g)), h), h)), x);

            //
            //  QR step.
            //
            cs = I;
            sn = I;
            l1 = l + 1;

            for (i=l1; l1<=k; ++l1)
            {
                g = t[i-1];
                y = s[i-1];
                h = n_mul(sn, g);
                g = n_mul(cs, g);
                w = n_hypot(h, f);
                t[i-1-1] = w;
                cs = n_div(f, w);
                sn = n_div(h, w);
                f = n_add(n_mul(x, cs), n_mul(g, sn));
                g = n_sub(n_mul(g, cs), n_mul(x, sn));
                h = n_mul(y, sn);
                y = n_mul(y, cs);

                if (0 < nv)
                {
                    for (j=1; j<=n; ++j)
                    {
                        x = real(v[j-1][i-1-1]);
                        w = real(v[j-1][i-1]);
                        v[j-1][i-1-1] = n_add(n_mul(x, cs), n_mul(w, sn));
                        v[j-1][i-1]   = n_sub(n_mul(w, cs), n_mul(x, sn));
                    }
                }

                w = n_hypot(h, f);
                s[i-1-1] = w;
                cs = n_div(f, w);
                sn = n_div(h, w);
                f = n_add(n_mul(cs, g), n_mul(sn, y));
                x = n_sub(n_mul(cs, y), n_mul(sn, g));

                if (0 < nu)
                {
                    for (j=1; j<=n; ++j)
                    {
                        y = real(u[j-1][i-1-1]);
                        w = real(u[j-1][i-1]);
                        u[j-1][i-1-1] = n_add(n_mul(y, cs), n_mul(w, sn));
                        u[j-1][i-1]   = n_sub(n_mul(w, cs), n_mul(y, sn));
                    }
                }

                if (0 < p)
                {
                    for (j=n+1; j<=n+p; ++j)
                    {
                        q = a[i-1-1][j-1];
                        r = a[i-1][j-1];
                        a[i-1-1][j-1] = scalar_add(scalar_mul(q, cs), scalar_mul(r, sn));
                        a[i-1][j-1]   = scalar_sub(scalar_mul(r, cs), scalar_mul(q, sn));
                    }
                }
            }

            t[l-1] = O;
            t[k-1] = f;
            s[k-1] = x;
            //go to 220
        }

        //
        //  Convergence.
        //
        //360     continue
        if (n_lt(w, O))
        {
            s[k-1] = n_neg(w);
            if (0 < nv)
            {
                for (j=1; j<=n; ++j)
                {
                    v[j-1][k-1] = scalar_neg(v[j-1][k-1]);
                }
            }
        }
    }

    //
    //  Sort the singular values.
    //
    for (k=1; k<=n; ++k)
    {
        g = -1;
        j = k;

        for (i=k; i<=n; ++i)
        {
            if (n_gt(s[i-1], g))
            {
                g = s[i-1];
                j = i;
            }
        }

        if (j !== k)
        {
            s[j-1] = s[k-1];
            s[k-1] = g;

            //
            //  Interchange V(1:N,J) and V(1:N,K).
            //
            if (0 < nv)
            {
                for (i=1; i<=n; ++i)
                {
                    q           = v[i-1][j-1];
                    v[i-1][j-1] = v[i-1][k-1];
                    v[i-1][k-1] = q;
                }
            }

            //
            //  Interchange U(1:N,J) and U(1:N,K).
            //
            if (0 < nu)
            {
                for (i=1; i<=n; ++i)
                {
                    q           = u[i-1][j-1];
                    u[i-1][j-1] = u[i-1][k-1];
                    u[i-1][k-1] = q;
                }
            }

            //
            //  Interchange A(J,N1:NP) and A(K,N1:NP).
            //
            if (0 < p)
            {
                for (i=n+1; i<=n+p; ++i)
                {
                    q           = a[j-1][i-1];
                    a[j-1][i-1] = a[k-1][i-1];
                    a[k-1][i-1] = q;
                }
            }
        }
    }

    //
    //  Back transformation.
    //
    if (0 < nu)
    {
        for (kk=1; kk<=n; ++kk)
        {
            k = n + 1 - kk;
            if (!n_eq(b[k-1], O))
            {
                q = scalar_neg(scalar_sign((a[k-1][k-1])));

                for (j=1; j<=nu; ++j)
                {
                    u[k-1][j-1] = scalar_mul(q, u[k-1][j-1]);
                }

                for (j=1; j<=nu; ++j)
                {
                    q = O;
                    for (i=k; i<=m; ++i)
                    {
                        q = scalar_add(q, scalar_mul(scalar_conj(a[i-1][k-1]), u[i-1][j-1]));
                    }
                    q = scalar_div(q, scalar_mul(scalar_abs(a[k-1][k-1]), b[k-1]));
                    for (i=k; i<=m; ++i)
                    {
                        u[i-1][j-1] = scalar_sub(u[i-1][j-1], scalar_mul(q, (a[i-1][k-1])));
                    }
                }
            }
        }
    }

    if (0 < nv)
    {
        if (2 <= n)
        {
            for (kk=2; kk<=n; ++kk)
            {
                k = n + 1 - kk;
                k1 = k + 1;

                if (!n_eq(c[k1-1], O))
                {
                    q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k1-1])));
                    for (j=1; j<=nv; ++j)
                    {
                        v[k1-1][j-1] = scalar_mul(q, v[k1-1][j-1]);
                    }

                    for (j=1; j<=nv; ++j)
                    {
                        q = O;
                        for (i=k1; i<=n; ++i)
                        {
                            q = scalar_add(q, scalar_mul((a[k-1][i-1]), v[i-1][j-1]));
                        }
                        q = scalar_div(q, scalar_mul(scalar_abs(a[k-1][k1-1]), c[k1-1]));
                        for (i=k1; i<=n; ++i)
                        {
                            v[i-1][j-1] = scalar_sub(v[i-1][j-1], scalar_mul(q, scalar_conj(a[k-1][i-1])));
                        }
                    }
                }
            }
        }
    }
    return wantu && wantv ? [realify(u), s, realify(v)] : (wantu || wantv ? [realify(u || v), s] : s);
}
fn.svd = varargout(function(nargout, x, eps) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("svd");
    if (1 < nargout)
    {
        var ans = svd(x, eps, 1 < nargout, 2 < nargout);
        return [ans[0], diag(ans[1]), ans[2]];
    }
    else
    {
        return svd(x, eps, false, false);
    }
});
