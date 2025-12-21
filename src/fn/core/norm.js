function norm(x, p)
{
    if (null == p) p = two;
    if (is_inf(p))
    {
        x = vec(x);
        if (is_scalar(x))
        {
            return scalar_abs(x);
        }
        else if (is_vector(x))
        {
            return n_lt(p, O) ? min(abs(x)) : max(abs(x));
        }
        else if (is_matrix(x))
        {
            if (n_gt(p, O))
            {
                return max(sum(abs(transpose(x))));
            }
        }
    }
    else if (is_num(p))
    {
        x = vec(x);
        if (n_eq(p, I))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return sum(abs(x));
            }
            else if (is_matrix(x))
            {
                return max(sum(abs(x)));
            }
        }
        else if (n_eq(p, two))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return d_euclidean(x);
            }
            else if (is_matrix(x))
            {
                return max(svd(x, null, false, false));
            }
        }
        else if (n_gt(p, O))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return d_minkowski(x, p);
                //return n_pow(sum(x.map(function(xi) {return scalar_pow(scalar_abs(xi), p);})), n_inv(p));
            }
        }
    }
    else if ('fro' === p)
    {
        if (is_matrix(x))
        {
            return realMath.sqrt(trace(real(mul(ctranspose(x), x))));
        }
    }
    not_supported("norm");
}
fn.norm = norm;
