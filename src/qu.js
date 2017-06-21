'use strict';
if (typeof module === 'undefined') window.module = {};
var qu = module.exports = function(){
	var o = {},
		val, poolVals = [];
	o.qu = [];
	o.cur = -1;
	o.stack = function(cb){
		o.qu.push({stack:cb});
	};
	o.pool = function(cb){
		if (o.qu.length < 1 || !o.qu[o.qu.length-1].pool) o.qu.push({pool:[]});
		o.qu[o.qu.length-1].pool.push(cb);
	};
	o.fail = function(cb){
		o.qu.push({fail:cb});
	};
	o.cancel = function(cb){
		o.qu = [];
	};
	o.val = function(){
		return val;
	};
	o.rewind = function(times){
		if (times === undefined) times = 1;
		o.cur = o.cur - times;
	};
	o.start = function(d){
		pass(d);
	};
	var fail = function(d){
		val = d;
		o.cur++;
		if (!o.qu[o.cur]) return;
		if (o.qu[o.cur].fail){
			var done = {
				pass:pass,
				fail:fail
			};
			o.qu[o.cur].fail(done);
			return;
		}
		fail(d);
	};
	var pass = function(d){
		val = d;
		o.cur++;
		if (!o.qu[o.cur]) return;
		if (o.qu[o.cur].stack){
			var done = {
				pass:pass,
				fail:fail
			};
			o.qu[o.cur].stack(done);
			return;
		}
		if (o.qu[o.cur].pool){
			poolVals = [];
			for (var i=0,len=o.qu[o.cur].pool.length;i<len;i++){
				(function(ind){
					var done = {
						pass:function(d){
							if (!o.qu[o.cur]) return;
							o.qu[o.cur].pool[ind].passed = true;
							poolVals[ind] = d;
							for (var j=0,lenJ=o.qu[o.cur].pool.length;j<lenJ;j++){
								if (!o.qu[o.cur].pool[j].passed) return;
							}
							pass(poolVals);
						},
						fail:fail
					};
					o.qu[o.cur].pool[ind](done);
				})(i);
			}
			return;
		}
		pass(d);
	};
	return o;
};