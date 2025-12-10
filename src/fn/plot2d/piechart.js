fn.piechart = function(/*..args*/) {
    var fig = figure().parse(arguments, 'pie');
    return fig.data.length ? fig.render('pie', $_.createCanvas(700, 525)/*4:3*/) : null;
};
fn.donutchart = function(/*..args*/) {
    return fn.piechart.apply([].slice.call(arguments));
};
