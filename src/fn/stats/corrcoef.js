function corrcoef(a, b)
{
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
            return pearson(a, b);
        }
        else if (is_2d(a) && is_2d(b))
        {
            if (!arr_eq(size(a), size(b))) throw "corrcoef: inputs not of same dimension";
            /*return array(COLS(a), function(column) {
                return corrcoef(COL(a, column), COL(b, column));
            });*/
            return corrcoef([colon(a), colon(b)]);
        }
    }
    not_supported("corrcoef");
}
fn.corrcoef = corrcoef;
