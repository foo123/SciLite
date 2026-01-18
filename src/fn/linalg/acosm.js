/*function normAm(A, m)
{
    return norm(pow(A, m), inf);
    var n = ROWS(A), e, j, c, mv;
    // for positive matrices only
    e = ones(n, 1);
    A = ctranspose(A);
    for (j=1; j<=m; ++j)
    {
        e = mul(A, e);
    }
    c = norm(e, inf);
    //mv = m;
    return c;//[c, mv];
}*/
function acosm(A)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acosm.m

    // Beta values for the backward error analysis.
    var beta = [
     __(0.000034417071) // k = 1
    ,__(0.004807320816) // k = 2
    ,__(0.039685094175) // k = 3
    ,__(0.126262963075) // k = 4
    ,__(0.258567093540) // k = 5
    ,__(0.416519074566) // k = 6
    ,__(0.580947286323) // k = 7
    ,__(0.738997052037) // k = 8
    ,__(0.883885725911) // k = 9
    ,__(1.013025759393) // k = 10
    ,__(1.126269612452) // k = 11
    ,__(1.224699157280) // k = 12
    ],
    n = ROWS(A),
    WT = schur(A, true, "complex"),
    W = WT[0], T = WT[1],
    In = eye(n),
    s = 0,
    k = 0,
    d = diag(T),
    d2, d3, d4, d5,
    a2, a3, a4,
    p, q, P, Q,
    Z, powZ, ZZ, S1, S2;

    if (any(d, function(d) {return n_eq(imag(d), O) && (n_eq(real(d), J) || n_eq(real(d), I));}))
    {
        console.warn("acosm: input must not have an eigenvalue of 1 or -1 else result may be unreliable!");
    }

    // Compute lower bound on the number of square roots required.
    while (gt(norm(sub(I, d), inf), beta[7]))
    {
        ++s;
        d = fn.sqrt(dotdiv(add(I, d), two));
    }
    for (i=1; i<=s; ++i)
    {
        T = sqrtm_tri(dotdiv(add(In, T), two));
    }

    // Determine degree of approximant.
    while (0 === k)
    {
        Z = sub(In, T);

        powZ = mul_tri(Z, Z);
        d2 = n_pow(norm(powZ, inf), 1/2);
        powZ = mul_tri(Z, powZ);
        d3 = n_pow(norm(powZ, inf), 1/3);
        a2 = n_gt(d2, d3) ? d2 : d3;
        if (n_le(a2, beta[0])) {k = 1; break;}
        if (n_le(a2, beta[1])) {k = 2; break;}
        powZ = mul_tri(Z, powZ);
        d4 = n_pow(norm(powZ, inf), 1/4);
        a3 = n_gt(d3, d4) ? d3 : d4;
        if (n_le(a3, beta[2])) {k = 3; break;}
        if (n_le(a3, beta[3])) {k = 4; break;}
        if (n_le(a3, beta[4])) {k = 5; break;}
        powZ = mul_tri(Z, powZ);
        d5 = n_pow(norm(powZ, inf), 1/5);
        a4 = n_gt(d4, d5) ? d4 : d5;
        a4 = n_lt(a3, a4) ? a3 : a4;
        if (n_le(a4, beta[5])) {k = 6; break;}
        if (n_le(a4, beta[6])) {k = 7; break;}
        if (n_le(a4, beta[7])) {k = 8; break;}

        T = sqrtm_tri(dotdiv(add(In, T), two));
        ++s;
    }

    // Pade coefficients obtained with Mathematica (rounded to floating point).
    // For better efficiency the Pade approximants should be evaluated
    // using the Paterson-Stockmeyer algorithm.
    if (1 === k)
    {
        p = [
        I,
        __(-0.1417)
        ];

        q = [
        I,
        __(-0.2250)
        ];
    }
    else if (2 === k)
    {
        p = [
        I,
        __(-0.3891),
        __(0.0187)
        ];

        q = [
        I,
        __(-0.4724),
        __(0.0393)
        ];
    }
    else if (3 === k)
    {
        p = [
        I,
        __(-0.6381843806),
        __(0.0998258508),
        __(-0.0024223030)
        ];

        q = [
        I,
        __(-0.7215177140),
        __(0.1412023270),
        __(-0.0062410636)
        ];
    }
    else if (4 === k)
    {
        p = [
        I,
        __(-0.8877087699),
        __(0.2433623027),
        __(-0.0212197774),
        __(0.0003104661)
        ];

        q = [
        I,
        __(-0.9710421032),
        __(0.3055324779),
        __(-0.0340541349),
        __(0.0009394670)
        ];
    }
    else if (5 === k)
    {
        p = [
        I,
        __(-1.1374227978),
        __(0.4493652033),
        __(-0.0719901333),
        __(0.0040450280),
        __(-0.0000395692)
        ];

        q = [
        I,
        __(-1.2207561311),
        __(0.5323448809),
        __(-0.0990433864),
        __(0.0072305607),
        __(-0.0001367979)
        ];
    }
    else if (6 === k)
    {
        p = [
        I,
        __(-1.3872329589),
        __(0.7178511241),
        __(-0.1703500659),
        __(0.0182193375),
        __(-0.0007178871),
        __(0.0000050248)
        ];

        q = [
        I,
        __(-1.4705662922),
        __(0.8216483151),
        __(-0.2168279980),
        __(0.0271898450),
        __(-0.0014099871),
        __(0.0000194672)
        ];
    }
    else if (7 === k)
    {
        p = [
        I,
        __(-1.6370982760),
        __(1.0488276715),
        __(-0.3319213490),
        __(0.0537536569),
        __(-0.0041439924),
        __(0.0001211160),
        __(-0.0000006365)
        ];

        q = [
        I,
        __(-1.7204316094),
        __(1.1734469723),
        __(-0.4030308611),
        __(0.0730391826),
        __(-0.0066542668),
        __(0.0002586530),
        __(-0.0000027240)
        ];
    }
    else if (8 === k)
    {
        p = [
        I,
        __(-1.8869980457),
        __(1.4422987012),
        __(-0.5723275787),
        __(0.1254739271),
        __(-0.0149128371),
        __(0.0008717583),
        __(-0.0000196760),
        __(0.0000000805)
        ];

        q = [
        I,
        __(-1.9703313790),
        __(1.5877429828),
        __(-0.6732761377),
        __(0.1609063722),
        __(-0.0215156706),
        __(0.0014963185),
        __(-0.0000453099),
        __(0.0000003763)
        ];
    }
    else
    {
        p = [I];

        q = [I];
    }

    ZZ = array(p.length, function(i, ZZ) {
        return 0 === i ? In : (1 === i ? Z : mul_tri(Z, ZZ[i-1]));
    });
    P = zeros(n, n);
    Q = zeros(n, n);
    ZZ.forEach(function(ZZi, i) {
        P = add(P, dotmul(p[i], ZZi));
        Q = add(Q, dotmul(q[i], ZZi));
    });
    S1 = linsolve(Q, P);
    S2 = mul(dotmul(S1, sqrt2), sqrtm_tri(Z));
    S2 = dotmul(n_pow(two, s), S2);
    return mul(mul(W, S2), ctranspose(W));
}
fn.acosm = function(A) {
    if (is_scalar(A)) return fn.acos(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("acosm");
    return acosm(A);
};
