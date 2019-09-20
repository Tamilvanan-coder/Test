/*
 Highcharts JS v7.1.3 (2019-08-14)

 Sankey diagram module

 (c) 2010-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(a) {
    "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/sankey", ["highcharts"], function(r) {
        a(r);
        a.Highcharts = r;
        return a
    }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(a) {
    function r(h, a, y, u) {
        h.hasOwnProperty(a) || (h[a] = u.apply(null, y))
    }
    a = a ? a._modules : {};
    r(a, "mixins/nodes.js", [a["parts/Globals.js"], a["parts/Utilities.js"]], function(h, a) {
        var p = a.defined,
            u = h.pick,
            m = h.Point;
        h.NodesMixin = {
            createNode: function(a) {
                function l(c, f) {
                    return h.find(c, function(c) {
                        return c.id === f
                    })
                }
                var b = l(this.nodes, a),
                    v = this.pointClass;
                if (!b) {
                    var q = this.options.nodes && l(this.options.nodes, a);
                    b = (new v).init(this, h.extend({
                        className: "highcharts-node",
                        isNode: !0,
                        id: a,
                        y: 1
                    }, q));
                    b.linksTo = [];
                    b.linksFrom = [];
                    b.formatPrefix = "node";
                    b.name = b.name || b.options.id;
                    b.mass = u(b.options.mass, b.options.marker && b.options.marker.radius, this.options.marker && this.options.marker.radius, 4);
                    b.getSum = function() {
                        var c = 0,
                            f = 0;
                        b.linksTo.forEach(function(d) {
                            c +=
                                d.weight
                        });
                        b.linksFrom.forEach(function(c) {
                            f += c.weight
                        });
                        return Math.max(c, f)
                    };
                    b.offset = function(c, f) {
                        for (var d = 0, t = 0; t < b[f].length; t++) {
                            if (b[f][t] === c) return d;
                            d += b[f][t].weight
                        }
                    };
                    b.hasShape = function() {
                        var c = 0;
                        b.linksTo.forEach(function(f) {
                            f.outgoing && c++
                        });
                        return !b.linksTo.length || c !== b.linksTo.length
                    };
                    this.nodes.push(b)
                }
                return b
            },
            generatePoints: function() {
                var a = this.chart,
                    l = {};
                h.Series.prototype.generatePoints.call(this);
                this.nodes || (this.nodes = []);
                this.colorCounter = 0;
                this.nodes.forEach(function(b) {
                    b.linksFrom.length =
                        0;
                    b.linksTo.length = 0;
                    b.level = void 0
                });
                this.points.forEach(function(b) {
                    p(b.from) && (l[b.from] || (l[b.from] = this.createNode(b.from)), l[b.from].linksFrom.push(b), b.fromNode = l[b.from], a.styledMode ? b.colorIndex = u(b.options.colorIndex, l[b.from].colorIndex) : b.color = b.options.color || l[b.from].color);
                    p(b.to) && (l[b.to] || (l[b.to] = this.createNode(b.to)), l[b.to].linksTo.push(b), b.toNode = l[b.to]);
                    b.name = b.name || b.id
                }, this);
                this.nodeLookup = l
            },
            setData: function() {
                this.nodes && (this.nodes.forEach(function(a) {
                        a.destroy()
                    }),
                    this.nodes.length = 0);
                h.Series.prototype.setData.apply(this, arguments)
            },
            destroy: function() {
                this.data = [].concat(this.points || [], this.nodes);
                return h.Series.prototype.destroy.apply(this, arguments)
            },
            setNodeState: function(a) {
                var h = arguments,
                    b = this.isNode ? this.linksTo.concat(this.linksFrom) : [this.fromNode, this.toNode];
                "select" !== a && b.forEach(function(b) {
                    b.series && (m.prototype.setState.apply(b, h), b.isNode || (b.fromNode.graphic && m.prototype.setState.apply(b.fromNode, h), b.toNode.graphic && m.prototype.setState.apply(b.toNode,
                        h)))
                });
                m.prototype.setState.apply(this, h)
            }
        }
    });
    r(a, "mixins/tree-series.js", [a["parts/Globals.js"], a["parts/Utilities.js"]], function(h, a) {
        var r = a.isArray,
            u = a.isNumber,
            m = a.isObject,
            p = h.extend,
            l = h.merge,
            b = h.pick;
        return {
            getColor: function(a, q) {
                var c = q.index,
                    f = q.mapOptionsToLevel,
                    d = q.parentColor,
                    t = q.parentColorIndex,
                    e = q.series,
                    k = q.colors,
                    n = q.siblings,
                    g = e.points,
                    C = e.chart.options.chart,
                    w;
                if (a) {
                    g = g[a.i];
                    a = f[a.level] || {};
                    if (f = g && a.colorByPoint) {
                        var v = g.index % (k ? k.length : C.colorCount);
                        var l = k && k[v]
                    }
                    if (!e.chart.styledMode) {
                        k =
                            g && g.options.color;
                        C = a && a.color;
                        if (w = d) w = (w = a && a.colorVariation) && "brightness" === w.key ? h.color(d).brighten(c / n * w.to).get() : d;
                        w = b(k, C, l, w, e.color)
                    }
                    var m = b(g && g.options.colorIndex, a && a.colorIndex, v, t, q.colorIndex)
                }
                return {
                    color: w,
                    colorIndex: m
                }
            },
            getLevelOptions: function(b) {
                var a = null;
                if (m(b)) {
                    a = {};
                    var c = u(b.from) ? b.from : 1;
                    var f = b.levels;
                    var d = {};
                    var t = m(b.defaults) ? b.defaults : {};
                    r(f) && (d = f.reduce(function(b, d) {
                        if (m(d) && u(d.level)) {
                            var f = l({}, d);
                            var g = "boolean" === typeof f.levelIsConstant ? f.levelIsConstant :
                                t.levelIsConstant;
                            delete f.levelIsConstant;
                            delete f.level;
                            d = d.level + (g ? 0 : c - 1);
                            m(b[d]) ? p(b[d], f) : b[d] = f
                        }
                        return b
                    }, {}));
                    f = u(b.to) ? b.to : 1;
                    for (b = 0; b <= f; b++) a[b] = l({}, t, m(d[b]) ? d[b] : {})
                }
                return a
            },
            setTreeValues: function f(a, c) {
                var d = c.before,
                    t = c.idRoot,
                    e = c.mapIdToNode[t],
                    k = c.points[a.i],
                    n = k && k.options || {},
                    g = 0,
                    h = [];
                p(a, {
                    levelDynamic: a.level - (("boolean" === typeof c.levelIsConstant ? c.levelIsConstant : 1) ? 0 : e.level),
                    name: b(k && k.name, ""),
                    visible: t === a.id || ("boolean" === typeof c.visible ? c.visible : !1)
                });
                "function" ===
                typeof d && (a = d(a, c));
                a.children.forEach(function(d, b) {
                    var e = p({}, c);
                    p(e, {
                        index: b,
                        siblings: a.children.length,
                        visible: a.visible
                    });
                    d = f(d, e);
                    h.push(d);
                    d.visible && (g += d.val)
                });
                a.visible = 0 < g || a.visible;
                d = b(n.value, g);
                p(a, {
                    children: h,
                    childrenTotal: g,
                    isLeaf: a.visible && !g,
                    val: d
                });
                return a
            },
            updateRootId: function(a) {
                if (m(a)) {
                    var c = m(a.options) ? a.options : {};
                    c = b(a.rootNode, c.rootId, "");
                    m(a.userOptions) && (a.userOptions.rootId = c);
                    a.rootNode = c
                }
                return c
            }
        }
    });
    r(a, "modules/sankey.src.js", [a["parts/Globals.js"], a["parts/Utilities.js"],
        a["mixins/tree-series.js"]
    ], function(a, p, r) {
        var h = p.defined,
            m = p.isObject,
            y = r.getLevelOptions,
            l = a.find,
            b = a.merge;
        p = a.seriesType;
        var v = a.pick,
            q = a.Point;
        p("sankey", "column", {
            borderWidth: 0,
            colorByPoint: !0,
            curveFactor: .33,
            dataLabels: {
                enabled: !0,
                backgroundColor: "none",
                crop: !1,
                nodeFormat: void 0,
                nodeFormatter: function() {
                    return this.point.name
                },
                format: void 0,
                formatter: function() {},
                inside: !0
            },
            inactiveOtherPoints: !0,
            linkOpacity: .5,
            minLinkWidth: 0,
            nodeWidth: 20,
            nodePadding: 10,
            showInLegend: !1,
            states: {
                hover: {
                    linkOpacity: 1
                },
                inactive: {
                    linkOpacity: .1,
                    opacity: .1,
                    animation: {
                        duration: 50
                    }
                }
            },
            tooltip: {
                followPointer: !0,
                headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
                pointFormat: "{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>",
                nodeFormat: "{point.name}: <b>{point.sum}</b><br/>"
            }
        }, {
            isCartesian: !1,
            invertable: !0,
            forceDL: !0,
            orderNodes: !0,
            pointArrayMap: ["from", "to"],
            createNode: a.NodesMixin.createNode,
            setData: a.NodesMixin.setData,
            destroy: a.NodesMixin.destroy,
            getNodePadding: function() {
                return this.options.nodePadding
            },
            createNodeColumn: function() {
                var c = this.chart,
                    b = [],
                    d = this.getNodePadding();
                b.sum = function() {
                    return this.reduce(function(b, d) {
                        return b + d.getSum()
                    }, 0)
                };
                b.offset = function(c, f) {
                    for (var e = 0, t, g = 0; g < b.length; g++) {
                        t = b[g].getSum() * f + d;
                        if (b[g] === c) return {
                            relativeTop: e + a.relativeLength(c.options.offset || 0, t)
                        };
                        e += t
                    }
                };
                b.top = function(b) {
                    var a = this.reduce(function(c, a) {
                        0 < c && (c += d);
                        return c += a.getSum() * b
                    }, 0);
                    return (c.plotSizeY - a) / 2
                };
                return b
            },
            createNodeColumns: function() {
                var b = [];
                this.nodes.forEach(function(a) {
                    var c = -1,
                        d;
                    if (!h(a.options.column))
                        if (0 === a.linksTo.length) a.column = 0;
                        else {
                            for (d = 0; d < a.linksTo.length; d++) {
                                var f = a.linksTo[0];
                                if (f.fromNode.column > c) {
                                    var n = f.fromNode;
                                    c = n.column
                                }
                            }
                            a.column = c + 1;
                            "hanging" === n.options.layout && (a.hangsFrom = n, d = -1, l(n.linksFrom, function(b, c) {
                                (b = b.toNode === a) && (d = c);
                                return b
                            }), a.column += d)
                        } b[a.column] || (b[a.column] = this.createNodeColumn());
                    b[a.column].push(a)
                }, this);
                for (var a = 0; a < b.length; a++) void 0 === b[a] && (b[a] = this.createNodeColumn());
                return b
            },
            hasData: function() {
                return !!this.processedXData.length
            },
            pointAttribs: function(b, f) {
                var c = this.mapOptionsToLevel[(b.isNode ? b.level : b.fromNode.level) || 0] || {},
                    t = b.options,
                    e = c.states && c.states[f] || {};
                f = ["colorByPoint", "borderColor", "borderWidth", "linkOpacity"].reduce(function(b, a) {
                    b[a] = v(e[a], t[a], c[a]);
                    return b
                }, {});
                var k = v(e.color, t.color, f.colorByPoint ? b.color : c.color);
                return b.isNode ? {
                    fill: k,
                    stroke: f.borderColor,
                    "stroke-width": f.borderWidth
                } : {
                    fill: a.color(k).setOpacity(f.linkOpacity).get()
                }
            },
            generatePoints: function() {
                function b(a, c) {
                    void 0 === a.level &&
                        (a.level = c, a.linksFrom.forEach(function(a) {
                            b(a.toNode, c + 1)
                        }))
                }
                a.NodesMixin.generatePoints.apply(this, arguments);
                this.orderNodes && (this.nodes.filter(function(a) {
                    return 0 === a.linksTo.length
                }).forEach(function(a) {
                    b(a, 0)
                }), a.stableSort(this.nodes, function(a, b) {
                    return a.level - b.level
                }))
            },
            translateNode: function(a, f) {
                var d = this.translationFactor,
                    c = this.chart,
                    e = this.options,
                    k = a.getSum(),
                    n = Math.round(k * d),
                    g = Math.round(e.borderWidth) % 2 / 2,
                    h = f.offset(a, d);
                f = Math.floor(v(h.absoluteTop, f.top(d) + h.relativeTop)) +
                    g;
                g = Math.floor(this.colDistance * a.column + e.borderWidth / 2) + g;
                g = c.inverted ? c.plotSizeX - g : g;
                d = Math.round(this.nodeWidth);
                a.sum = k;
                a.shapeType = "rect";
                a.nodeX = g;
                a.nodeY = f;
                a.shapeArgs = c.inverted ? {
                    x: g - d,
                    y: c.plotSizeY - f - n,
                    width: a.options.height || e.height || d,
                    height: a.options.width || e.width || n
                } : {
                    x: g,
                    y: f,
                    width: a.options.width || e.width || d,
                    height: a.options.height || e.height || n
                };
                a.shapeArgs.display = a.hasShape() ? "" : "none";
                c = this.mapOptionsToLevel[a.level];
                e = a.options;
                e = m(e) ? e.dataLabels : {};
                c = m(c) ? c.dataLabels : {};
                c = b({
                    style: {}
                }, c, e);
                a.dlOptions = c;
                a.plotY = 1
            },
            translateLink: function(a) {
                var b = a.fromNode,
                    d = a.toNode,
                    c = this.chart,
                    e = this.translationFactor,
                    k = Math.max(a.weight * e, this.options.minLinkWidth),
                    n = this.options,
                    g = b.offset(a, "linksFrom") * e,
                    h = (c.inverted ? -this.colDistance : this.colDistance) * n.curveFactor;
                g = b.nodeY + g;
                n = b.nodeX;
                e = this.nodeColumns[d.column].top(e) + d.offset(a, "linksTo") * e + this.nodeColumns[d.column].offset(d, e).relativeTop;
                var l = this.nodeWidth;
                d = d.column * this.colDistance;
                var m = a.outgoing,
                    p = d > n;
                c.inverted &&
                    (g = c.plotSizeY - g, e = c.plotSizeY - e, d = c.plotSizeX - d, l = -l, k = -k, p = n > d);
                a.shapeType = "path";
                a.linkBase = [g, g + k, e, e + k];
                if (p) a.shapeArgs = {
                    d: ["M", n + l, g, "C", n + l + h, g, d - h, e, d, e, "L", d + (m ? l : 0), e + k / 2, "L", d, e + k, "C", d - h, e + k, n + l + h, g + k, n + l, g + k, "z"]
                };
                else {
                    h = d - 20 - k;
                    m = d - 20;
                    p = d;
                    var q = n + l,
                        r = q + 20,
                        u = r + k,
                        v = g,
                        z = g + k,
                        y = z + 20;
                    c = y + (c.plotHeight - g - k);
                    var x = c + 20,
                        B = x + k,
                        D = e,
                        A = D + k,
                        E = A + 20,
                        F = x + .7 * k,
                        G = p - .7 * k,
                        H = q + .7 * k;
                    a.shapeArgs = {
                        d: ["M", q, v, "C", H, v, u, z - .7 * k, u, y, "L", u, c, "C", u, F, H, B, q, B, "L", p, B, "C", G, B, h, F, h, c, "L", h, E, "C", h, A - .7 * k, G, D, p, D, "L",
                            p, A, "C", m, A, m, A, m, E, "L", m, c, "C", m, x, m, x, p, x, "L", q, x, "C", r, x, r, x, r, c, "L", r, y, "C", r, z, r, z, q, z, "z"
                        ]
                    }
                }
                a.dlBox = {
                    x: n + (d - n + l) / 2,
                    y: g + (e - g) / 2,
                    height: k,
                    width: 0
                };
                a.y = a.plotY = 1;
                a.color || (a.color = b.color)
            },
            translate: function() {
                this.processedXData || this.processData();
                this.generatePoints();
                this.nodeColumns = this.createNodeColumns();
                this.nodeWidth = a.relativeLength(this.options.nodeWidth, this.chart.plotSizeX);
                var b = this,
                    f = this.chart,
                    d = this.options,
                    h = this.nodeWidth,
                    e = this.nodeColumns,
                    k = this.getNodePadding();
                this.translationFactor =
                    e.reduce(function(a, b) {
                        return Math.min(a, (f.plotSizeY - d.borderWidth - (b.length - 1) * k) / b.sum())
                    }, Infinity);
                this.colDistance = (f.plotSizeX - h - d.borderWidth) / (e.length - 1);
                b.mapOptionsToLevel = y({
                    from: 1,
                    levels: d.levels,
                    to: e.length - 1,
                    defaults: {
                        borderColor: d.borderColor,
                        borderRadius: d.borderRadius,
                        borderWidth: d.borderWidth,
                        color: b.color,
                        colorByPoint: d.colorByPoint,
                        levelIsConstant: !0,
                        linkColor: d.linkColor,
                        linkLineWidth: d.linkLineWidth,
                        linkOpacity: d.linkOpacity,
                        states: d.states
                    }
                });
                e.forEach(function(a) {
                    a.forEach(function(c) {
                        b.translateNode(c,
                            a)
                    })
                }, this);
                this.nodes.forEach(function(a) {
                    a.linksFrom.forEach(function(a) {
                        b.translateLink(a);
                        a.allowShadow = !1
                    })
                })
            },
            render: function() {
                var b = this.points;
                this.points = this.points.concat(this.nodes || []);
                a.seriesTypes.column.prototype.render.call(this);
                this.points = b
            },
            animate: a.Series.prototype.animate
        }, {
            applyOptions: function(a, b) {
                q.prototype.applyOptions.call(this, a, b);
                h(this.options.level) && (this.options.column = this.column = this.options.level);
                return this
            },
            setState: a.NodesMixin.setNodeState,
            getClassName: function() {
                return (this.isNode ?
                    "highcharts-node " : "highcharts-link ") + q.prototype.getClassName.call(this)
            },
            isValid: function() {
                return this.isNode || "number" === typeof this.weight
            }
        });
        ""
    });
    r(a, "masters/modules/sankey.src.js", [], function() {})
});
//# sourceMappingURL=sankey.js.map