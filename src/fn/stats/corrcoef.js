function corrcoef(a, b)
{
    var I = __(1);
    if (null == b)
    {
        if (is_scalar(a) || is_vector(a))
        {
            return I;
        }
        else if (is_matrix(a))
        {
            return matrix(COLS(a), COLS(a), function(column1, column2, m) {
                return column1 === column2 ? I : (column1 > column2 ? m[column2][column1] : corrcoef(COL(a, column1), COL(a, column2)));
            });
        }
    }
    else
    {
        if (is_scalar(a) && is_scalar(b))
        {
            return I;
        }
        else if (is_vector(a) && is_vector(b))
        {
            if (a.length !== b.length) throw "corrcoef: inputs not of same dimension";
            var N = a.length;
            return 1 < N ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), __(N-1)) : I;
        }
        else if (is_matrix(a) && is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "corrcoef: inputs not of same dimension";
            return array(COLS(a), function(column) {
                return corrcoef(COL(a, column), COL(b, column));
            });
        }
    }
    not_supported("corrcoef");
}
fn.corrcoef = corrcoef;
