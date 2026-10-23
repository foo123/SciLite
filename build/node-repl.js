(function() {
"use strict";

const $ = require('./SciLite.js');

// support nd-arrays
$._.tensorview(require('./TensorView.js'));

// optionally use arbitrary precision arithmetic via Decimal
$._.decimal(require('./decimal.js'));

let ctx = null, warnings = [], server = null;
let fig_data = null, fig_params = null,
    fig_type = null, fig_no = 0,
    fig_closed = [];
const fig_html = `
<!doctype html>
<html lang="en">
<head>
<title>Figure $FIG$</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width">
<style type="text/css">
html {
    margin: 0;
    padding: 0;
}
body {
    font-size: 16px;
    font-family: Helvetica, sans-serif;
    color: #343434;
    background: #fff;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0;
}
#fig {
    position: relative;
    box-sizing: border-box;
    display: block;
    margin: 0 auto;
    max-width: 100%;
    width: 700px;
    height: auto;
    background: #fff;
    --aspect-ratio: calc(4 / 3);
}
#fig::before {
    position: relative;
    box-sizing: border-box;
    display: block;
    content: "";
    padding: 0;
    width: 100%;
    height: auto;
    padding-bottom: calc(100% / var(--aspect-ratio));
}
#fig .plot-container.plotly {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
#fig.fig3d .plot-container.plotly svg:not(:root) {
  display: none !important;
}
</style>
</head>
<body>
<div id="fig"></div>
<script>
const stdMath = Math;
const graph = {
plot: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            mode: 'lines',
            line: {
                width: data.style.LineWidth || 1,
                dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
loglog: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            mode: 'lines',
            line: {
                width: data.style.LineWidth || 1,
                dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'log',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'log',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
semilogx: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            mode: 'lines',
            line: {
                width: data.style.LineWidth || 1,
                dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'log',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
semilogy: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            mode: 'lines',
            line: {
                width: data.style.LineWidth || 1,
                dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'log',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
scatter: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            type: 'scatter',
            mode: 'markers',
            marker: {
                width: data.style.LineWidth,
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
bar: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.x,
            y: data.y,
            name: 'input '+String(i+1),
            type: 'bar',
            marker: {
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        barmode: 'group',
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
barh: function(el, data) {
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            x: data.y,
            y: data.x,
            name: 'input '+String(i+1),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
            }
        };
    }), {
        xaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        yaxis: {
            type: 'linear',
            linewidth: 2,
            showticklabels: true,
            showgrid: false,
            gridcolor: '#eee',
            griddash: 'solid',
            gridwidth: 2,
            showline: true,
            mirror: 'ticks',
            ticks: 'inside',
            tickmode: 'auto',
            autorange: true,
            zeroline: false
        },
        barmode: 'group',
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
piechart: function(el, data) {
    let m = data.length;
    if ((1 < m) && (m & 1)) ++m;
    const rows = stdMath.floor(stdMath.sqrt(m));
    const cols = m/rows;
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            name: 'input '+String(i+1),
            labels: data.y.map((_, j) => 'label '+String(j)),
            values: data.y,
            type: 'pie',
            direction: 'clockwise',
            textinfo: 'percent'/*'label+percent'*/,
            textposition: 'inside',
            sort: false,
            domain: {
                row: stdMath.floor(i/cols),
                column: i % cols
            }
        };
    }), {
        margin: {b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff',
        grid: {rows: rows, columns: cols}
    }, {
        responsive: true,
        displayModeBar: false
    });
},
donutchart: function(el, data) {
    let m = data.length;
    if ((1 < m) && (m & 1)) ++m;
    const rows = stdMath.floor(stdMath.sqrt(m));
    const cols = m/rows;
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            name: 'input '+String(i+1),
            labels: data.y.map((_, j) => 'label '+String(j)),
            values: data.y,
            type: 'pie',
            hole: .4,
            direction: 'clockwise',
            textinfo: 'percent'/*'label+percent'*/,
            textposition: 'inside',
            sort: false,
            domain: {
                row: stdMath.floor(i/cols),
                column: i % cols
            }
        };
    }), {
        margin: {b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff',
        grid: {rows: rows, columns: cols}
    }, {
        responsive: true,
        displayModeBar: false
    });
},
contour: function(el, data) {
    if (data.x && data.y && data.z)
    {
        Plotly.newPlot(el, [{
            type: 'contour',
            x: data.x,
            y: data.y,
            z: data.z,
            autocontour: !(Array.isArray(data.v) || ('number' === typeof data.v)),
            contours: Array.isArray(data.v) ? {
                coloring: 'lines',
                start: data.v[0],
                end: data.v[data.v.length-1],
                size: 1
            } : ('number' === typeof data.v  ? {
                coloring: 'lines',
                start: data.v,
                end: data.v,
                size: 1
            } : {
                coloring: 'lines'
            })
        }], {
            xaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
                gridcolor: '#eee',
                griddash: 'solid',
                gridwidth: 2,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                tickmode: 'auto',
                autorange: true,
                zeroline: false
            },
            yaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
                gridcolor: '#eee',
                griddash: 'solid',
                gridwidth: 2,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                tickmode: 'auto',
                autorange: true,
                zeroline: false
            },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff'
        }, {
            responsive: true,
            displayModeBar: false
        });
    }
    else
    {
        Plotly.newPlot(el, [{
            type: 'contour',
            z: data.z,
            autocontour: !(Array.isArray(data.v) || ('number' === typeof data.v)),
            contours: Array.isArray(data.v) ? {
                coloring: 'lines',
                start: data.v[0],
                end: data.v[data.v.length-1],
                size: 1
            } : ('number' === typeof data.v  ? {
                coloring: 'lines',
                start: data.v,
                end: data.v,
                size: 1
            } : {
                coloring: 'lines'
            })
        }], {
            xaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
                gridcolor: '#eee',
                griddash: 'solid',
                gridwidth: 2,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                tickmode: 'auto',
                autorange: true,
                zeroline: false
            },
            yaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
                gridcolor: '#eee',
                griddash: 'solid',
                gridwidth: 2,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                tickmode: 'auto',
                autorange: true,
                zeroline: false
            },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff'
        }, {
            responsive: true,
            displayModeBar: false
        });
    }
},
plot3: function(el, data) {
    el.className = 'fig3d';
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            type: 'scatter3d',
            mode: 'lines',
            x: data.x,
            y: data.y,
            z: data.z,
            name: 'input '+String(i+1),
            line: {
                width: data.style.LineWidth || 1,
                dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')',
                reversescale: false
            }
        };
    }), {
        margin: {t:0, b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
scatter3: function(el, data) {
    el.className = 'fig3d';
    Plotly.newPlot(el, data.map(function(data, i) {
        return {
            type: 'scatter3d',
            mode: 'markers',
            x: data.x,
            y: data.y,
            z: data.z,
            name: 'input '+String(i+1),
            marker: {
                size: 2*(data.style.LineWidth || 1),
                //dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style.LineStyle || '-')],
                color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')',
                reversescale: false
            }
        };
    }), {
        margin: {t:0, b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
},
mesh: function(el, data) {
    el.className = 'fig3d';
    Plotly.newPlot(el, [{
        type: 'mesh3d',
        x: data.x,
        y: data.y,
        z: data.z
    }], {
        margin: {t:0, b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        responsive: true,
        displayModeBar: false
    });
}
};
function check_closed(close)
{
    fetch(close)
    .then(function(res) {
        return res.json();
    })
    .then(function(is_closed) {
        if (is_closed) self.close();
        else setTimeout(() => check_closed(close), 200);
    })
    .catch(function(err) {});
}
(function fig(type, data, params, close, init) {
    const width = $WIDTH$, height = $HEIGHT$;
    if (init)
    {
        if (window.opener)
        {
            window.opener.close();
            window.opener = null;
        }
        window.resizeTo(
            width + (window.outerWidth - window.innerWidth),
            height + (window.outerHeight - window.innerHeight)
        );
        if (close) check_closed(close);
    }
    if (!window.Plotly)
    {
        setTimeout(() => fig(type, data, params, close, false), 100);
    }
    else if (data && type && ("function" === typeof graph[type]))
    {
        const el = document.getElementById('fig');
        el.className = 'fig2d';
        graph[type](el, data);
        if (params)
        {
            setTimeout(function update() {
                fetch(params)
                .then(function(res) {
                    return res.json();
                })
                .then(function(params) {
                    if (params)
                    {
                        if (params.legend)
                        {
                            Plotly.update(el, params.legend[0], {}, params.legend[1]);
                            delete params.legend;
                        }
                        Plotly.relayout(el, params);
                    }
                    setTimeout(update, 500);
                })
                .catch(function(err) {});
            }, 500);
        }
    }
})($TYPE$, $DATA$, $PARAMS$, $CLOSE$, true);
</script>
<script async src="https://cdn.plot.ly/plotly-3.3.0.min.js" charset="utf-8"></script>
</body>
</html>
`;

// extend with plugins
$.fn.exist = function(variable) {
    return ctx && $._.exist(variable, ctx) ? 1 : 0;
};
$.fn.clear = function() {
    ctx = null;
};
$.fn.warning = function(msg) {
    if (msg.length)
    {
        msg = 'Warning: '+ (1 < arguments.length ? $.fn.sprintf.apply(null, [].slice.call(arguments)) : msg);
        warnings.push(msg);
    }
};
$.fn.eval = async function(code) {
    if (null == ctx) ctx = $._.createContext();
    return await $._.eval(code, ctx, 1, 1);
};
$.fn.xlabel = function(text) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        fig_params['xaxis.title'] = {text:text};
    }
};
$.fn.ylabel = function(text) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        fig_params['yaxis.title'] = {text:text};
    }
};
$.fn.zlabel = function(text) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        fig_params['zaxis.title'] = {text:text};
    }
};
$.fn.title = function(text) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        fig_params.title = {text:text};
    }
};
$.fn.legend = function(/*..args*/) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        let names = [].slice.call(arguments);
        if ((1 === arguments.length) && Array.isArray(names[0])) names = names[0];
        if (Array.isArray(names[0]))
        {
            fig_params.legend = [{labels: names}, names.map((_, i) => i)];
        }
        else
        {
            fig_params.legend = [{name: names.map(name => String(name))}, names.map((_, i) => i)];
        }
    }
};
$.fn.grid = function(on) {
    if (fig_type)
    {
        fig_params = fig_params || {};
        fig_params['xaxis.showgrid'] = "on" === on;
        fig_params['yaxis.showgrid'] = "on" === on;
    }
};
$.fn.close = function(fig) {
    if ("all" === fig)
    {
        fig_closed = "all";
    }
    else if ("all" === fig_closed)
    {
        // pass
    }
    else
    {
        if (Array.isArray(fig))
        {
            fig = $._.tonumber($._.vec(fig));
        }
        else
        {
            fig = [$._.tonumber(fig)];
        }
        fig.forEach(function(fig) {
            fig = +fig;
            if (("number" === typeof fig) && !isNaN(fig) && (-1 === fig_closed.indexOf(fig)))
            {
                fig_closed.push(fig);
            }
        });
    }
};
([
'plot',
'loglog',
'semilogx',
'semilogy',
'scatter',
'bar',
'barh',
'piechart',
'donutchart',
'plot3',
'scatter3'
]).forEach(function(plot_type) {
$.fn[plot_type] = $._.namevalueargs(function(/*..args*/) {
    const fig = $._.figure().parse(arguments, -1 < ['piechart','donutchart'].indexOf(plot_type) ? 'pie' : (-1 < ['plot3','scatter3'].indexOf(plot_type) ? 'plot3' : 'plot'));
    if (fig.data.length)
    {
        if ("all" === fig_closed) fig_closed = [];
        ++fig_no;
        fig_type = plot_type;
        fig_params = null;
        fig_data = fig.data;
        return figure();
    }
}, {
    Color: null,
    LineWidth: 1,
    LineStyle: '-'
}, 'repeatable');
});
$.fn.contour = function(x, y, z, v) {
    if ("all" === fig_closed) fig_closed = [];
    ++fig_no;
    fig_type = 'contour';
    fig_params = null;
    if (3 <= arguments.length)
    {
        fig_data = {
            x: $._.tonumber($._.vec($.fn.colon(x))),
            y: $._.tonumber($._.vec($.fn.colon(y))),
            z: $._.tonumber($._.vec($.fn.colon(z))),
            v: $._.tonumber(Array.isArray(v) ? $._.vec(v) : v)
        };
    }
    else
    {
        z = x;
        v = y;
        fig_data = {
            z: $._.tonumber($._.vec($.fn.colon(z))),
            v: $._.tonumber(Array.isArray(v) ? $._.vec(v) : v)
        };
    }
    return figure();
};
$.fn.mesh = function(x, y, z) {
    if ("all" === fig_closed) fig_closed = [];
    ++fig_no;
    fig_type = 'mesh';
    fig_params = null;
    fig_data = {
        x: $._.tonumber($._.vec($.fn.colon(x))),
        y: $._.tonumber($._.vec($.fn.colon(y))),
        z: $._.tonumber($._.vec($.fn.colon(z)))
    };
    return figure();
};
$._.MAXPRINTSIZE = 10;

async function figure()
{
    const host = 'http://localhost:1173';
    const width = 800, height = 600; // window size
    if (!server)
    {
        await new Promise(function(resolve, reject) {
            server = require('http').createServer(function(req, res) {
                const url = new URL(host+req.url), figno = String(fig_no);
                if ('/open_figure_'+figno+'.html' === url.pathname)
                {
                    // open current figure html
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(
`
<!doctype html>
<html lang="en">
<head>
<title>Opening Figure `+figno+`..</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width">
<style type="text/css">
body {
background:#fff;
color:#343434;
font-family:Helvetica, sans-serif;
font-size:20px;
}
p {
position:relative;
margin:0;
padding:0;
font-weight:bold;
}
p#msg {
display:none;
}
</style>
</head>
<body>
Opening Figure <b>`+figno+`</b>..<br>
<p id="msg">The figure popup window is probably blocked.<br>Unblock popups from <span style="font-family:monospace">`+host+`</span> to continue.<br>Then you can close this window, if it does not close automatically.</p>
<noscript><p>JavaScript needs to be enabled for figures to work!<br>Enable JavaScript and re-run the code that creates the figure.<br>You can close this window.</p></noscript>
<script>
const fig = window.open("`+host+`/fig/`+figno+`.html", "_scilite_figure_`+figno+`", "popup,width=`+String(width)+`,height=`+String(height)+`");
if (!fig || fig.closed) document.getElementById('msg').style.display = 'block';
</script>
</body>
</html>
`
                    );
                }
                else if ('/close_figure.json' === url.pathname)
                {
                    // is figure closed?
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    if ("all" === fig_closed)
                    {
                        res.end(JSON.stringify(true));
                    }
                    else
                    {
                        const index = (fig_closed || []).indexOf(parseInt(url.searchParams.get('fig') || '') || 0);
                        if (-1 < index)
                        {
                            fig_closed.splice(index, 1);
                            res.end(JSON.stringify(true));
                        }
                        else
                        {
                            res.end(JSON.stringify(false));
                        }
                    }
                }
                else if ('/fig/'+figno+'.html' === url.pathname)
                {
                    // serve current figure html
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(
                    fig_html
                    .split('$FIG$').join(figno)
                    .split('$WIDTH$').join(String(width))
                    .split('$HEIGHT$').join(String(height))
                    .split('$TYPE$').join('"'+fig_type+'"')
                    .split('$PARAMS$').join('"./'+figno+'.json"')
                    .split('$CLOSE$').join('"'+host+'/close_figure.json?fig='+figno+'"')
                    .split('$DATA$').join(JSON.stringify(fig_data))
                    );
                }
                else if ('/fig/'+figno+'.json' === url.pathname)
                {
                    // serve current figure (updated) params
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(fig_params));
                }
                else
                {
                    // ignore
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Not found!');
                }
            });
            server.listen(1173/*lite*/, function() {
                //server running at http://localhost:1173/
                resolve();
            });
        });
    }
    await new Promise(function(resolve, reject) {
        require('child_process').exec(('darwin' === process.platform ? 'open ' : ('win32' === process.platform ? 'start ' : 'xdg-open ')) + /*'msedge '+*//*'chrome '+ */(host+'/open_figure_'+String(fig_no)+'.html'), {windowsHide:true}, function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}
const repl = require('repl').start({
    prompt: '>> ',
    ignoreUndefined: true,
    writer: function(ans) {
        let out = '';
        if (warnings.length)
        {
            out = warnings.join('\n');
            warnings = [];
        }
        if (null != ans)
        {
            out += (out.length ? '\n' : '') + (ans instanceof Error ? ans.toString() : $._.str(ans));
        }
        return out;
    },
    eval: function(code, context, replResourceName, cb) {
        code = String(code).trim();
        if (!code.length) return cb();
        if (null == ctx) ctx = $._.createContext();
        $._.eval(code, ctx, 1, 1).then(ans => cb(null, (null == ans) && !warnings.length ? undefined : ans)).catch(err => cb(new Error(err.message || err)));
    }
});
repl.on('reset', function() {
    ctx = null;
});

})();