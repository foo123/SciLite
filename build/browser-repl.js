(function(window) {
"use strict";

const document = window.document;
const stdMath = Math;

let ctx = null;
let cnt = 0;
let printCompleted = Promise.resolve();
const CM = {};
let currentLine = 0;
let currentCanvas = null;
let currentFig = null;
let useArbitraryPrecision = false;

function print_code(output, code, CodeMirror)
{
    if (!output) return;
    if ((null == code) || !code.length) return;
    const lines = code.split("\n");
    const textarea = document.createElement('textarea');
    textarea.id = 'code-' + String(cnt);
    textarea.className = 'code';
    textarea.innerHTML = code;
    output.appendChild(textarea);
    const cm = CodeMirror.fromTextArea(textarea, {
        mode: "scilite",
        readOnly: true,
        lineWrapping: false,
        viewportMargin: Infinity,
        indentUnit: 4,
        indentWithTabs: false,
        foldGutter: false,
        lineNumbers: true,
        firstLineNumber: currentLine+1,
        gutters: ["window.CodeMirror-linenumbers"]
    });
    //cm.setSize(null, lines.length*28/*(lines.reduce((m, l) => stdMath.max(m, l.length), 0) > 80 ? 38 : 22)*/);
    CM[textarea.id] = cm;
    currentLine += lines.length;
}
function print_math(output, tex, MathJax)
{
    if (!output) return;
    if ((null == tex) || !tex.length) return;
    if (MathJax.typesetPromise)
    {
        const math = document.createElement('div');
        math.id = 'math-' + String(cnt);
        math.className = 'math';
        math.innerHTML = tex;
        output.appendChild(math);
        printCompleted = printCompleted.then(function() {
            return MathJax.typesetPromise([math]);
        }).catch(function(err) {
            console.error('MathJax.Typeset failed: ' + err.message)
        });
    }
}
function print_fig(output, el, Plotly)
{
    if (!output) return;
    if (!el) return;
    if (!el.id) el.id = 'fig-' + String(cnt);
    if (el instanceof window.HTMLCanvasElement)
    {
        currentCanvas = el;
        el.className = 'fig';
    }
    else
    {
        currentFig = el;
    }
    output.appendChild(el);
}
function print_err(output, err)
{
    if (!output) return;
    if (!err) return;
    const error = document.createElement('div');
    error.id = 'err-' + String(cnt);
    error.className = 'err';
    error.innerHTML = esc_html(err.toString());
    output.appendChild(error);
}
function esc_html(s)
{
    return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split(' ').join('&nbsp;').split("\n").join('<br>');
}
function use_arbitrary_precision(enable, $, Decimal)
{
    if (!Decimal) return false;
    if (enable)
    {
        if (useArbitraryPrecision) return false;
        $._.decimal(Decimal);
        useArbitraryPrecision = true;
        return true;
    }
    else
    {
        if (!useArbitraryPrecision) return false;
        $._.decimal(false);
        useArbitraryPrecision = false;
        return true;
    }
}
function clear(output, CodeMirror, MathJax, Plotly)
{
    [].forEach.call(output.children, function(el) {
        if (el.classList.contains('fig2d') || el.classList.contains('fig3d'))
        {
            if (Plotly) Plotly.purge(el);
        }
        else if ('math' === el.className)
        {
            if (MathJax && MathJax.typesetClear) MathJax.typesetClear([el]);
            //el.textContent = '';
        }
        else if ('code' === el.className)
        {
            if (CodeMirror)
            {
                const cm = CM[el.id || ''];
                if (cm)
                {
                    delete CM[el.id];
                    cm.toTextArea();
                }
            }
        }
    });
    output.textContent = '';
    currentLine = 0;
    currentCanvas = null;
    currentFig = null;
    cnt = 0;
    ctx = null;
}
async function repl(code, output, $, CodeMirror, MathJax, Plotly)
{
    // read
    if (null == code) return;
    code = String(code).trim();
    if (!code.length) return;

    // eval
    if (null == ctx) ctx = $._.createContext();
    let ans = null, err = null;
    try {
        ans = await $._.eval(code, ctx, currentLine+1, 1);
    } catch (e) {
        err = e;
        ans = null;
    }

    // print
    ++cnt;
    print_code(output, code, CodeMirror);
    if (err)
    {
        print_err(output, err);
    }
    else if (ans instanceof window.Element)
    {
        print_fig(output, ans, Plotly);
    }
    else if (null != ans)
    {
        // if not output suppressed, print output
        if (!/;\s*$/.test(code.split("\n").pop())) print_math(output, $._.tex(ans), MathJax);
    }
    printCompleted = printCompleted.then(() => output.scrollTop = output.scrollHeight);
}

window.BrowserREPL = function($, Decimal, MathJax, Plotly, CodeMirror, CodeMirrorGrammar, codemirror_define_grammar_mode) {
// extend with plugins
/*$.fn.clc = function() {
    printCompleted = printCompleted.then(() => window.clear());
};*/
$.fn.exist = function(variable) {
    return ctx && $._.exist(variable, ctx) ? 1 : 0;
};
$.fn.clear = function() {
    ctx = null;
};
$.fn.eval = async function(code) {
    if (null == ctx) ctx = $._.createContext();
    return await $._.eval(code, ctx, 1, 1);
};
$.fn.xlabel = function(text) {
    if (currentFig)
    {
        Plotly.relayout(currentFig, {'xaxis.title': {text:text}});
        return currentFig;
    }
};
$.fn.ylabel = function(text) {
    if (currentFig)
    {
        Plotly.relayout(currentFig, {'yaxis.title': {text:text}});
        return currentFig;
    }
};
$.fn.zlabel = function(text) {
    if (currentFig)
    {
        Plotly.relayout(currentFig, {'zaxis.title': {text:text}});
        return currentFig;
    }
};
$.fn.title = function(text) {
    if (currentFig)
    {
        Plotly.relayout(currentFig, {title: {text:text}});
        return currentFig;
    }
};
$.fn.legend = function(/*..args*/) {
    if (currentFig)
    {
        let names = [].slice.call(arguments);
        if ((1 === arguments.length) && Array.isArray(names[0])) names = names[0];
        if (Array.isArray(names[0]))
        {
            Plotly.update(currentFig, {labels: names}, {}, names.map((_, i) => i));
        }
        else
        {
            Plotly.update(currentFig, {name: names.map(name => String(name))}, {}, names.map((_, i) => i));
        }
        return currentFig;
    }
};
$.fn.plot = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                x: data.x,
                y: data.y,
                name: 'input '+String(i+1),
                mode: 'lines',
                line: {
                    width: data.style.LineWidth || 1,
                    dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
                }
            };
        }), {
            xaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.loglog = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                x: data.x,
                y: data.y,
                name: 'input '+String(i+1),
                mode: 'lines',
                line: {
                    width: data.style.LineWidth || 1,
                    dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
                }
            };
        }), {
            xaxis: {
                type: 'log',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.semilogx = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                x: data.x,
                y: data.y,
                name: 'input '+String(i+1),
                mode: 'lines',
                line: {
                    width: data.style.LineWidth || 1,
                    dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
                }
            };
        }), {
            xaxis: {
                type: 'log',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.semilogy = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                x: data.x,
                y: data.y,
                name: 'input '+String(i+1),
                mode: 'lines',
                line: {
                    width: data.style.LineWidth || 1,
                    dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')'
                }
            };
        }), {
            xaxis: {
                type: 'linear',
                linewidth: 2,
                showticklabels: true,
                showgrid: false,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.scatter = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.bar = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.barh = function(/*..args*/) {
    const fig = $._.figure().parse(arguments);
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.piechart = function(/*..args*/) {
    const fig = $._.figure().parse(arguments, 'pie');
    if (fig.data.length)
    {
        let m = fig.data.length;
        if ((1 < m) && (m & 1)) ++m;
        const rows = stdMath.floor(stdMath.sqrt(m));
        const cols = m/rows;
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                name: 'input '+String(i+1),
                labels: $.fn.colon(1, data.y.length).map(j => 'label '+String(j)),
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.donutchart = function(/*..args*/) {
    const fig = $._.figure().parse(arguments, 'pie');
    if (fig.data.length)
    {
        let m = fig.data.length;
        if ((1 < m) && (m & 1)) ++m;
        const rows = stdMath.floor(stdMath.sqrt(m));
        const cols = m/rows;
        const el = document.createElement('div');
        el.className = 'fig2d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                name: 'input '+String(i+1),
                labels: $.fn.colon(1, data.y.length).map(j => 'label '+String(j)),
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.contour = function(x, y, z, v) {
    const el = document.createElement('div');
    el.className = 'fig2d';
    document.body.appendChild(el);
    if (3 <= arguments.length)
    {
        Plotly.newPlot(el, [{
            type: 'contour',
            x: $.fn.colon($._.tonumber(x)),
            y: $.fn.colon($._.tonumber(y)),
            z: $.fn.colon($._.tonumber(z)),
            autocontour: !(Array.isArray(v) || ('number' === typeof v)),
            contours: Array.isArray(v) ? {
                coloring: 'lines',
                start: v[0],
                end: v[v.length-1],
                size: 1
            } : ('number' === typeof v  ? {
                coloring: 'lines',
                start: v,
                end: v,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
    }
    else
    {
        z = x;
        v = y;
        Plotly.newPlot(el, [{
            type: 'contour',
            z: $._.tonumber(z),
            autocontour: !(Array.isArray(v) || ('number' === typeof v)),
            contours: Array.isArray(v) ? {
                coloring: 'lines',
                start: v[0],
                end: v[v.length-1],
                size: 1
            } : ('number' === typeof v  ? {
                coloring: 'lines',
                start: v,
                end: v,
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
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
    }
    return el;
};
$.fn.plot3 = function(/*..args*/) {
    const fig = $._.figure().parse(arguments, 'plot3');
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig3d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                type: 'scatter3d',
                mode: 'lines',
                x: data.x,
                y: data.y,
                z: data.z,
                name: 'input '+String(i+1),
                line: {
                    width: data.style.LineWidth || 1,
                    dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')',
                    reversescale: false
                }
            };
        }), {
            margin: {t:0, b:0, l:0, r:0},
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff'
        }, {
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.scatter3 = function(/*..args*/) {
    const fig = $._.figure().parse(arguments, 'plot3');
    if (fig.data.length)
    {
        const el = document.createElement('div');
        el.className = 'fig3d';
        document.body.appendChild(el);
        Plotly.newPlot(el, fig.data.map(function(data, i) {
            return {
                type: 'scatter3d',
                mode: 'markers',
                x: data.x,
                y: data.y,
                z: data.z,
                name: 'input '+String(i+1),
                marker: {
                    size: 2*(data.style.LineWidth || 1),
                    //dash: (['solid','dash','dot','dashdot'])[(['-','--',':','-.']).indexOf(data.style._LineStyle || '-')],
                    color: 'rgb('+data.style.Color.map(v => stdMath.round(255*v)).join(',')+')',
                    reversescale: false
                }
            };
        }), {
            margin: {t:0, b:0, l:0, r:0},
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff'
        }, {
            //staticPlot: true,
            responsive: true,
            displayModeBar: false
        });
        return el;
    }
};
$.fn.mesh = function(x, y, z) {
    const el = document.createElement('div');
    el.className = 'fig3d';
    document.body.appendChild(el);
    Plotly.newPlot(el, [{
        type: 'mesh3d',
        x: $.fn.colon($._.tonumber(x)),
        y: $.fn.colon($._.tonumber(y)),
        z: $.fn.colon($._.tonumber(z))
    }], {
        margin: {t:0, b:0, l:0, r:0},
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    }, {
        //staticPlot: true,
        responsive: true,
        displayModeBar: false
    });
    return el;
};

/*$._.createCanvas = function(w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
};
$._.currentCanvas = function() {
    return currentCanvas;
};*/

$._.MAXPRINTSIZE = 10;

codemirror_define_grammar_mode("scilite", {
// prefix ID for regular expressions used in the grammar
"RegExpID"                      : "RE::",

// Style model
"Style"                         : {

     "COMMENT"                  : "comment"
    ,"KEYWORD"                  : "keyword"
    ,"BUILTIN"                  : "builtin"
    ,"IDENTIFIER"               : "variable"
    ,"STRING"                   : "string"
    ,"NUMBER"                   : "number"
    ,"CONST"                    : "variable-2"
    ,"OP"                       : "def"

},

// Lexical model
"Lex"                           : {
    "<comment>"                 : {"type":"comment","tokens":[
                                    // line comment
                                    // start, end delims  (null matches end-of-line)
                                    ["%",  null]
                                ]}
    ,"<keyword>"                : {"autocomplete":true,"tokens":["if","elseif","else","for","while","break","continue","end"]}
    ,"<builtin>"                : {"autocomplete":true,"tokens":Object.keys($.fn)}
    ,"<identifier>"             : "RE::/[_A-Za-z][_A-Za-z0-9]*/"
    ,"<string>"                 : {"type":"block","tokens":
                                    ["RE::/(['\"])/",   1]
                                }
    ,"<number>"                 : "RE::/\\d+(?:\\.\\d+)?([eE]-?\\d+)?[ij]?/"
    ,"<const>"                 : {"autocomplete":true,"tokens":["realmax","realmin","intmax","intmin","eps","pi","e","inf","Inf","nan","NaN"]}
    ,"<t>"                      : [".'","'"]
    ,"<op>"                     : ["+","-",".'","'",".*","*","./","/","\\","&&","||","xor","==","~=",">=","<=",">","<","~","="]
},

// Syntax model
"Syntax"                        : {
    "<expr>"                    : "(<comment>.COMMENT | <string>.STRING | <number>.NUMBER | '['.OP | ']'.OP  <t>.OP? | '('.OP | ')'.OP  <t>.OP? | <op>.OP | <const>.CONST <t>.OP? | <keyword>.KEYWORD | <builtin>.BUILTIN | <identifier>.IDENTIFIER <t>.OP?)*"
},

// what to parse and in what order
"Parser"                        : [["<expr>"]]
}, {
"supportGrammarAnnotations" : false,
"supportCodeFolding"        : false,
"supportCodeMatching"       : false,
"supportAutoCompletion"     : true
}, CodeMirror, CodeMirrorGrammar);

return {
    repl: async function(code, output) {
        await repl(code, output, $, CodeMirror, MathJax, Plotly);
    },
    clear: function(output) {
        if (!output) return;
        clear(output, CodeMirror, MathJax, Plotly);
    },
    arbitraryPrecision: function(enable) {
        return use_arbitrary_precision(enable, $, Decimal);
    }
};
};

})(window);