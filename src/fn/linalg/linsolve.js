function linsolve(A, b, opts)
{
    // adapted from https://github.com/foo123/Abacus
    if (is_scalar(A) && is_scalar(b)) return scalar_div(b, A);

    if (!is_matrix(A)) return []; // invalid
    if (!is_vector(b) && !is_matrix(b)) return []; // invalid

    // solve linear system, when exactly solvable
    var k = COLS(A), br, bc;

    if (ROWS(A) !== k) return []; // no solution

    if (is_vector(b))
    {
        br = b.length;
        bc = 1;
    }
    else
    {
        br = ROWS(b);
        bc = COLS(b);
    }
    if (k !== br) return []; // no solution

    // A*X = B <=> ref(A.t|I) = R|T <=> iif R.t*P = B has solutions P => X = T.t*P
    var tmp = ref(transpose(A), true),
        pivots = tmp[1],
        rank = pivots.length,
        Tt, Rt, p, i, j, c, t;

    if (rank !== k) return []; // no solution

    Tt = transpose(tmp[3]);
    Rt = transpose(tmp[0]);
    if (is_vector(b))
    {
        // R.t*P can be easily solved by substitution
        p = array(k, O);
        for (i=0; i<k; ++i)
        {
            if (eq(Rt[i][i], O)) return []; // no solution
            for (t=O,j=0; j<i; ++j) t = scalar_add(t, scalar_mul(Rt[i][j], p[j]));
            p[i] = scalar_div(scalar_sub(b[i], t), Rt[i][i]);
        }
        // X = T.t*P
        return array(k, function(i) {
            return array(k, function(j) {
                return scalar_mul(p[j], Tt[i][j]);
            }).reduce(function(s, pti) {
                return scalar_add(s, pti);
            }, O);
        });
    }
    else
    {
        // R.t*P can be easily solved by substitution
        p = zeros(k, bc);
        for (i=0; i<k; ++i)
        {
            if (eq(Rt[i][i], O)) return []; // no solution
            for (c=0; c<bc; ++c)
            {
                for (t=O,j=0; j<i; ++j) t = scalar_add(t, scalar_mul(Rt[i][j], p[j][c]));
                p[i][c] = scalar_div(scalar_sub(b[i][c], t), Rt[i][i]);
            }
        }
        // X = T.t*P
        return matrix(k, bc, function(i, c) {
            return array(k, function(j) {
                return scalar_mul(p[j][c], Tt[i][j]);
            }).reduce(function(s, pti) {
                return scalar_add(s, pti);
            }, O);
        });
    }
}
fn.linsolve = linsolve;
function mldivide(A, b)
{
    return linsolve(A, b);
}
