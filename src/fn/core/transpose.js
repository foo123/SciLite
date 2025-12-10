function transpose(x)
{
    if (is_2d(x))
    {
        return matrix(COLS(x), ROWS(x), function(i, j) {
            return x[j][i];
        });
    }
    return x;
}
fn.transpose = transpose;
function ctranspose(x)
{
    if (is_2d(x))
    {
        return matrix(COLS(x), ROWS(x), function(i, j) {
            return is_scalar(x[j][i]) ? scalar_conj(x[j][i]) : x[j][i];
        });
    }
    else if (is_1d(x))
    {
        return x.map(function(xi) {
            return is_scalar(xi) ? scalar_conj(xi) : xi;
        });
    }
    else if (is_scalar(x))
    {
        return scalar_conj(x);
    }
    return x;
}
fn.ctranspose = ctranspose;
