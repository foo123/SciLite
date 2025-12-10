function blkdiag(matrices)
{
    var rows = 0, cols = 0, k = 0,
        mat, mat_rows, mat_cols,
        offset_row = 0, offset_col = 0;
    matrices.forEach(function(mat, i) {
        if (is_0d(mat)) matrices[i] = mat = [[mat]];
        if (is_1d(mat)) matrices[i] = mat = diag(mat);
        if (!is_2d(mat)) not_supported("blkdiag");
        rows += ROWS(mat);
        cols += COLS(mat);
    });
    mat = matrices[k];
    mat_rows = ROWS(mat);
    mat_cols = COLS(mat);
    return matrix(rows, cols, function(row, col) {
        if (row >= offset_row+mat_rows)
        {
            offset_row += mat_rows;
            offset_col += mat_cols;
            mat = matrices[++k];
            mat_rows = ROWS(mat);
            mat_cols = COLS(mat);
        }
        return (col < offset_col) || (col >= offset_col+mat_cols) ? 0 : (mat[row-offset_row][col-offset_col]);
    });
}
fn.blkdiag = function(/*..args*/) {
    return blkdiag([].slice.call(arguments));
};
