# Qu
Qu is a tiny object that is an alternate to Javascript promises. It organizes asynchronous Javascript code into neat packets that avoid the Javascript callback indentation hell. However, unlike promises, Qu does not require any special implementaton within the asychronous functions themselves. Here is Qu in action:

``` javascript

var q = qu();

q.stack(function(done){
	/*
	call functions and do work here, when complete call done.pass
	*/
	done.pass(1);
});

q.stack(function(done){
	var val = q.val(); // get value from previous chunk
	console.log('2:',val);
	done.fail('pool failed');
});

q.fail(function(done){
	var val = q.val();
	console.log('fail:',val);
	done.pass('f');
});

q.stack(function(done){
	var val = q.val();
	console.log('4:',val);
	done.pass();
});

q.start();

```

## How does it work?

Use Qu in two simple steps.

1. Define the stack
2. Start the Qu

## Define the Qu stack

First the stack of functions must be defined. There are three types of stacking methods: stack, pool, and fail.
