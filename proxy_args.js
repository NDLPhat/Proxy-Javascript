
/* LIB */
const NUMBER = 0;
const STRING = "0";

const ORI_FUNC = Symbol("ORI_FUNC");
const LOCK = Symbol("LOCK");
const PROPS = Symbol("PROPS");

const args = (...args) => (fn) => (...inputs) => {
	const stat = args.every((arg, idx) => typeof arg === typeof inputs[idx]);
	if (!stat) throw new Error("Format is wrong, please check");
	return fn(...inputs);
}

const middlewareHandler = function(fn){
	const wrap = fn(this);
	wrap[LOCK] = true;
	wrap[ORI_FUNC] = this[ORI_FUNC] || this;
	wrap[PROPS] = wrap[PROPS] || this[PROPS];
	return wrap;
}

const Handler = {
	get(target, prop){
		switch(prop){
			case "isMiddleware": return !!this.me[ORI_FUNC];
		}
		return this.me[PROPS][prop];
	},
	set(target, prop, value){
		if (!this.me[PROPS]) this.me[PROPS] = {};
		return this.me[PROPS][prop] = value;
	}
}

const PROXY = new Proxy(middlewareHandler, Handler);

Object.defineProperty(Function.prototype, "middleware", {
	get(){
		Handler.me = this;
		return PROXY;
	}
})


/* APPLICATION */

const format = (fn) => {
	const handler = (...inputs) => {
		return "[Result: " + fn(...inputs) + " ]";
	}
	handler.middleware.clear = function(){
		console.log("CLEARRRRRRRRR");
	}
	return handler
}

const sum = function(a, b){
	return a + b
}
.middleware(args(NUMBER, NUMBER))
.middleware(format)