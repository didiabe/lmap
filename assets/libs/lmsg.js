! function(e, t) {
	"function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.lmsg = t()
}(this, function() {
	var e = {};
	if (e.isLSAvailable = function() {
			var e = "_";
			try {
				return localStorage.setItem(e, e), localStorage.removeItem(e), !0
			} catch (t) {
				return !1
			}
		}(), e.isLSAvailable) {
		var t = 100,
			r = 1e3,
			o = localStorage,
			n = {},
			i = !1,
			f = {},
			u = function() {
				for (var e in n) {
					var i = o.getItem(e);
					if (i && f[e] && -1 === f[e].indexOf(i)) {
						f[e].push(i);
						try {
							var a = JSON.parse(i);
							a && (i = a)
						} catch (c) {}
						for (var s = 0; s < n[e].length; s++) n[e][s](i);
						o.getItem(e + "-removeit") || (o.setItem(e + "-removeit", "1"), function(t) {
							setTimeout(function() {
								o.removeItem(t), o.removeItem(t + "-removeit"), f[e] = []
							}, r)
						}(e))
					} else i || (f[e] = [])
				}
				return setTimeout(u, t), !0
			};
		e.send = function(e, t) {
			var r = "";
			"function" == typeof t && (t = t()), r = "object" == typeof t ? JSON.stringify(t) : t, o.setItem(e, r)
		}, e.subscribe = function(e, t) {
			n[e] || (n[e] = [], f[e] = []), n[e].push(t), i || (i = u())
		}, e.getBuffer = function() {
			return f
		}
	} else e.send = e.subscribe = function() {
		throw new Error("localStorage not supported.")
	};
	return e
});