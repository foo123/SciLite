function dot(a, b, asreal)
{
    asreal = true === asreal;
    if (is_scalar(a) && is_scalar(b))
    {
        return scalar_mul(a, asreal ? b : scalar_conj(b));
    }
    else if (is_vector(a) && is_vector(b))
    {
        if (a.length === b.length)
        {
            return a.reduce(function(sum, ai, i) {
                return scalar_add(sum, scalar_mul(ai, asreal ? b[i] : scalar_conj(b[i])));
            }, 0);
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return array(COLS(a), function(column) {
                return dot(COL(a, column), COL(b, column), asreal);
            });
        }
    }
    return 0;
}
fn.dot = dot;
