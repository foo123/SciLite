function real_qr_shift(A, i, sI, s, type)
{
    var ii, sc;
    sI[0] = A[i][i]
    sI[1] = A[i-1][i-1];
    sI[2] = scalar_mul(A[i][i-1], A[i-1][i]);
    if ('wilkinson' === type)
    {
        // Wilkinson shift
        s[0] = scalar_add(s[0], sI[0]);
        for (ii=0; ii<=i; ++ii) A[ii][ii] = scalar_sub(A[ii][ii], sI[0]);
        sc = scalar_add(scalar_abs(A[i][i-1]), scalar_abs(A[i-1][i-2]));
        sI[0] = scalar_mul(sc, 0.75);
        sI[1] = scalar_mul(sc, 0.75);
        sI[2] = scalar_mul(scalar_mul(sc, sc), -0.4375);
    }
    else if ('matlab' === type)
    {
        // MATLAB shift
        sc = scalar_div(scalar_sub(sI[1], sI[0]), two);
        sc = scalar_add(scalar_mul(sc, sc), sI[2]);
        if (gt(sc, O))
        {
            sc = fn.sqrt(sc);
            if (lt(sI[1], sI[0])) sc = scalar_neg(sc);
            sc = scalar_add(sc, scalar_div(scalar_sub(sI[1], sI[0]), two));
            sc = scalar_div(scalar_sub(sI[0], sI[2]), sc);
            s[0] = scalar_add(s[0], sc);
            for (ii=0; ii<=i; ++ii) A[ii][ii] = scalar_sub(A[ii][ii], sc);
            sI[0] = __(0.964); sI[1] = sI[2] = sI[0];
        }
    }
}
function split22block(A, U, i, s)
{
    // compute the eigenvalues of 2x2 block submatrix
    // by solving the quadratic characteristic equation
    var p = scalar_div(scalar_sub(A[i-1][i-1], A[i][i]), two),
        q = scalar_add(scalar_mul(p, p), scalar_mul(A[i][i-1], A[i-1][i])),
        G, G_t, z;

    // incorporate shift
    A[i][i] = scalar_add(A[i][i], s[0]);
    A[i-1][i-1] = scalar_add(A[i-1][i-1], s[0]);

    if (ge(q, O))
    {
        // 2 real eigenvalues, block 2x2 submatrix can be diagonalized
        z = realMath.sqrt(scalar_abs(q));
        G = compute_givens(ge(p, O) ? scalar_add(p, z) : scalar_sub(p, z), A[i][i-1]);
        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
        A = rotmul('left', G_t, i-1, i, A, i-1, null);//m_matT.rightCols(size - i + 1).applyOnTheLeft(i-1, i, rot.adjoint());
        A = rotmul('right', G, i-1, i, A, 0, i);//m_matT.topRows(i + 1).applyOnTheRight(i-1, i, rot);
        A[i][i-1] = O;
        if (U) U = rotmul('right', G, i-1, i, U);//m_matU.applyOnTheRight(i-1, i, rot);
    }

    if (i > 1) A[i-1][i-2] = O;
}
function complex_qr_shift(A, i, exceptional)
{
    if (exceptional)
    {
        // exceptional shift, avoid slow convergence heuristic
        return scalar_add(scalar_abs(real(A[i][i-1])), scalar_abs(real(A[i-1][i-2])));
    }
    else
    {
        // closest eigenvalue estimate as shift
        var T00 = A[i-1][i-1],
            T01 = A[i-1][i  ],
            T10 = A[i  ][i-1],
            T11 = A[i  ][i  ],
            normT = n_add(n_add(scalar_abs(T00), scalar_abs(T10)), n_add(scalar_abs(T01), scalar_abs(T11))),
            b, c, D, Det, Tr, e1, e2, n1, n2;
        T00 = scalar_div(T00, normT);
        T01 = scalar_div(T01, normT);
        T10 = scalar_div(T10, normT);
        T11 = scalar_div(T11, normT);
        b = scalar_mul(T01, T10);
        c = scalar_sub(T00, T11);
        D = fn.sqrt(scalar_add(scalar_mul(c, c), scalar_mul(b, 4)));
        Det = scalar_sub(scalar_mul(T00, T11), b);
        Tr = scalar_add(T00, T11);
        e1 = scalar_div(scalar_add(Tr, D), two);
        e2 = scalar_div(scalar_sub(Tr, D), two);
        n1 = scalar_abs(e1);
        n2 = scalar_abs(e2);
        if (n_gt(n1, n2))
        {
            e2 = scalar_div(Det, e1);
        }
        else if (!n_eq(n2, O))
        {
            e1 = scalar_div(Det, e2);
        }
        return n_lt(scalar_abs(scalar_sub(e1, T11)), scalar_abs(scalar_sub(e2, T11))) ? scalar_mul(e1, normT) : scalar_mul(e2, normT);
    }
}
function subdiagonal_negligible(A, i, eps)
{
    if (n_le(scalar_abs(A[i+1][i]), n_mul(n_add(scalar_abs(A[i][i]), scalar_abs(A[i+1][i+1])), eps)))
    {
        A[i+1][i] = O;
        return true;
    }
    return false;
}
function subdiagonal_negligible_entry(A, i, eps)
{
    while (i > 0)
    {
        if (n_le(scalar_abs(A[i][i-1]), n_mul(n_add(scalar_abs(A[i-1][i-1]), scalar_abs(A[i][i])), eps))) break;
        --i;
    }
    return i;
}
function schur(A, wantu, docomplex, eps)
{
    /*
    "Understanding the QR Algorithm", David S. Watkins, 1982
    "Understanding the QR Algorithm, Part II", David S. Watkins, 2001
    "Francis's Algorithm", David S. Watkins, 2011
    */
    // adapted from https://github.com/PX4/eigen

    // schur decomposition via qr algorithm
    var n = ROWS(A),
        i, k, im,
        il, iu = n-1,
        H, U, normH,
        s, sI,
        G, G_t, Hmm,
        v, hh,
        r, sc,
        lhs, rhs,
        iter = 0,
        total_iter = 0,
        max_iter = 100 * n, tol;

    eps = null == eps ? __(1e-8) : __(eps);

    // reduce to hessenberg form
    // that is invariant under qr algorithm and reduces computations
    H = hess(A, null, wantu, eps);
    if (wantu)
    {
        U = H[0];
        H = H[1];
    }

    if (docomplex)
    {
        // complex qr algorithm for hessenberg matrix with shifts and deflation
        // rows 0,...,il-1 are decoupled from the rest because H(il,il-1) is zero
        // rows il,...,iu is the part we are working on
        // rows iu+1,...,end are already brought in triangular form
        for (;;)
        {
            // find the bottom row of the active submatrix
            while (iu > 0)
            {
                if (!subdiagonal_negligible(H, iu-1, eps)) break;
                iter = 0;
                --iu;
            }

            // whole matrix is triangularized
            if (0 >= iu) break;

            ++iter;
            ++total_iter;
            if (total_iter >= max_iter) break;

            // find the top row of the active submatrix
            il = iu-1;
            while ((il > 0) && !subdiagonal_negligible(H, il-1, eps)) --il;

            // qr step with shift via givens rotation
            s = complex_qr_shift(H, iu, (iter === 10 || iter === 20) && (iu > 1));
            G = compute_givens(scalar_sub(H[il][il], s), H[il+1][il]);
            G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];

            H = rotmul('left', G_t, il, il+1, H, il, null);//m_matT.rightCols(m_matT.cols() - il).applyOnTheLeft(il, il + 1, rot.adjoint());
            H = rotmul('right', G, il, il+1, H, 0, stdMath.min(il+2, iu));//m_matT.topRows((std::min)(il + 2, iu) + 1).applyOnTheRight(il, il + 1, rot);
            H[il+1][il] = O;
            if (wantu) U = rotmul('right', G, il, il+1, U);//m_matU.applyOnTheRight(il, il + 1, rot);

            for (i=il+1; i<iu; ++i)
            {
                //rot.makeGivens(m_matT.coeffRef(i, i - 1), m_matT.coeffRef(i + 1, i - 1), &m_matT.coeffRef(i, i - 1));
                G = compute_givens(H[i][i-1], H[i+1][i-1]);
                G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                H[i][i-1] = scalar_add(scalar_mul(G[0], H[i][i-1]), scalar_mul(G[1], H[i+1][i-1]));
                H[i+1][i-1] = O;
                H = rotmul('left', G_t, i, i+1, H, i, null);//m_matT.rightCols(m_matT.cols() - i).applyOnTheLeft(i, i + 1, rot.adjoint());
                H = rotmul('right', G, i, i+1, H, 0, stdMath.min(i+2, iu));//m_matT.topRows((std::min)(i + 2, iu) + 1).applyOnTheRight(i, i + 1, rot);
                if (wantu) U = rotmul('right', G, i, i+1, U);//m_matU.applyOnTheRight(i, i + 1, rot);
            }
        }
    }
    else
    {
        // real qr algorithm for hessenberg matrix with shifts and deflation
        // rows 0,...,il-1 are decoupled from the rest because H(il,il-1) is zero
        // rows il,...,iu is the part we are working on
        // rows iu+1,...,end are already brought in triangular form
        tol = n_mul(norm(H, I), n_mul(eps, eps));
        //tol = n_gt(normH, constant.realmin) ? normH : constant.realmin;
        s = [O];
        sI = [O, O, O];
        while (iu >= 0)
        {
            il = subdiagonal_negligible_entry(H, iu, eps);

            if (il === iu)
            {
                // 1 root
                H[iu][iu] = scalar_add(H[iu][iu], s[0]);
                if (iu > 0) H[iu][iu-1] = O;
                --iu;
                iter = 0;
            }
            else if (il+1 === iu)
            {
                // 2 roots
                split22block(H, U, iu, s);
                iu -= 2;
                iter = 0;
            }
            else
            {
                // francis qr algorithm
                ++iter;
                ++total_iter;
                if (total_iter >= max_iter) break;
                v = [O, O, O];

                real_qr_shift(H, iu, sI, s, (iter > 0) && ((iter % 16) === 0) ? ((iter % 32) !== 0 ? 'wilkinson' : 'matlab') : 'none');

                // init francis qr step
                for (im=iu-2; im>=il; --im)
                {
                    Hmm = H[im][im];
                    r = scalar_sub(sI[0], Hmm);
                    sc = scalar_sub(sI[1], Hmm);
                    v[0] = scalar_add(scalar_div(scalar_sub(scalar_mul(r, sc), sI[2]), H[im+1][im]), H[im][im+1]);
                    v[1] = scalar_sub(scalar_sub(scalar_sub(H[im+1][im+1], Hmm), r), sc);
                    v[2] = H[im+2][im+1];
                    if (im === il) break;
                    lhs = scalar_mul(H[im][im-1], scalar_add(scalar_abs(v[1]), scalar_abs(v[2])));
                    rhs = scalar_mul(v[0], scalar_add(scalar_add(scalar_abs(H[im-1][im-1]), scalar_abs(Hmm)), scalar_abs(H[im+1][im+1])));
                    if (lt(scalar_abs(lhs), scalar_mul(rhs, eps))) break;
                }

                // francis qr step
                hh = {};
                hh.v = [I, O, O];
                for (k=im; k<=iu-2; ++k)
                {
                    //Matrix<Scalar, 2, 1> ess;
                    if (k === im)
                    {
                        //v = firstHouseholderVector;
                        //v.makeHouseholder(ess, tau, beta);
                        compute_householder(v, hh, 0, 2, 0, 0);
                    }
                    else
                    {
                        //v = m_matT.template block<3, 1>(k, k - 1);
                        //v.makeHouseholder(ess, tau, beta);
                        compute_householder(H, hh, k, k+2, k-1, k-1);
                    }

                    if (!eq(hh.beta, O))
                    {
                        if ((k === im) && (k > il))
                        {
                            H[k][k-1] = scalar_neg(H[k][k-1]);
                        }
                        else if (k !== im)
                        {
                            H[k][k-1] = hh.beta;
                        }

                        H = hh_mul('left', hh, H, k, k+2, k, null);//m_matT.block(k, k, 3, size - k).applyHouseholderOnTheLeft(ess, tau, workspace);
                        H = hh_mul('right', hh, H, k, k+2, 0, stdMath.min(iu, k+3));//m_matT.block(0, k, (std::min)(iu, k + 3) + 1, 3).applyHouseholderOnTheRight(ess, tau, workspace);
                        if (wantu) U = hh_mul('right', hh, U, k, k+2);//m_matU.block(0, k, size, 3).applyHouseholderOnTheRight(ess, tau, workspace);
                    }
                }

                //Matrix<Scalar, 2, 1> v = m_matT.template block<2, 1>(iu - 1, iu - 2);
                //Matrix<Scalar, 1, 1> ess;
                //v.makeHouseholder(ess, tau, beta);
                hh.v = [I, O];
                compute_householder(H, hh, iu-1, iu, iu-2, iu-2);

                if (!eq(hh.beta, O))
                {
                    H[iu-1][iu-2] = hh.beta;
                    H = hh_mul('left', hh, H, iu-1, iu, iu-1, null);//m_matT.block(iu - 1, iu - 1, 2, size - iu + 1).applyHouseholderOnTheLeft(ess, tau, workspace);
                    H = hh_mul('right', hh, H, iu-1, iu, 0, iu);//m_matT.block(0, iu - 1, iu + 1, 2).applyHouseholderOnTheRight(ess, tau, workspace);
                    if (wantu) U = hh_mul('right', hh, U, iu-1, iu);//m_matU.block(0, iu - 1, size, 2).applyHouseholderOnTheRight(ess, tau, workspace);
                }

                // zero-out round-off remainders
                for (i=im+2; i<=iu; ++i)
                {
                    H[i][i-2] = O;
                    if (i > im+2) H[i][i-3] = O;
                }
            }
        }
    }
    return wantu ? [U, H] : H;
}
fn.schur = varargout(function(nargout, A, mode) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("schur");
    return schur(A, 1 < nargout, "complex" === mode || !fn.isreal(A));
});
