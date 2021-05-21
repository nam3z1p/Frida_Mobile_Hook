console.log("[+] .js loaded successfully ");

////////////////////////////////////////////////////////
// Java Method Check
////////////////////////////////////////////////////////

function Method_Check(classcheck){
    classcheck.class.getDeclaredMethods().forEach(function (method) {
        var methodName = method.toString();
        console.log("[+] method name : " + methodName);
        try {
            // hook code
        } catch (e) {
            console.error(methodName, e);
        }
    });
}
//var MainActivity_Def = Java.use('com.test.app.MainActivity');
//function_check(MainActivity_Def);




////////////////////////////////////////////////////////
// Java method Hooking
// https://chp747.tistory.com/333
////////////////////////////////////////////////////////
/*
Java.perform(function() {
    //var MainActivity = Java.use('com.test.app.MainActivity');
    var target = Java.use('android.widget.TextView');
    var targetload = target.setText.overload('java.lang.CharSequence');
    //var String = Java.use("java.lang.String");

    targetload.implementation = function(args1){

        //var retval = args1.toString();
        //var retval = this.setText(args1);
        //var result='';
        //for(var i=0; i<retval.length; i++) {
        //    //result += String.fromCharCode(retval[i]);
        //    result += retval[i];
        //}
        //console.log("[+] result : " + result);

        console.log("[+] args1 : " + args1);

        //targetload.call(this, args1);
        //return this.setText(args1);

        // edit string
        var args1_edit = '';
        if(args1 == 'V3 Mobile Fake'){
            args1_edit = 'Hook Test';
        }

        console.log("[+] args1_edit : " + args1_edit);
        targetload.call(this, args1_edit);
    }
});
*/


////////////////////////////////////////////////////////
// Native Hooking
// https://secuinfo.tistory.com/entry/FRIDA-Frida%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-Native-Hooking
////////////////////////////////////////////////////////
/*
var didHookApis = false;
var moduleName = "libc.so";

Interceptor.attach(Module.findExportByName(null, 'dlopen'), {
    onEnter: function (args) {
        this.path = Memory.readUtf8String(args[0]);
        console.log(this.path);
    },
    onLeave: function (retval) {
        if(!retval.isNull() && this.path.indexOf(moduleName)!== -1 && !didHookApis) {
            didHookApis = true;
            console.log("[+] File loaded hooking");
            //hooknative2();
        }
    }
});

function hooknative2(){
    Interceptor.attach (Module.findExportByName(moduleName, "Java_com_devadvance_rootinspector_Root_checkifstream"), {
        onLeave: function (retval) {
            retval.replace(0);
        }
    });
}
*/



////////////////////////////////////////////////////////
// Native Hooking 2
// https://hacked-by-minibeef.tistory.com/22
////////////////////////////////////////////////////////
/*
var moduleName = "libfoo.so";
var nativeFuncAddr = 0x1234;

Interceptor.attach(Module.findExportByName(null, "dlopen"), {
    onEnter: function(args) {
        this.lib = Memory.readUtf8String(args[0]);
        console.log("dlopen called with: " + this.lib);
    },
    onLeave: function(retval) {
        if (this.lib.endsWith(moduleName)) {
            console.log("ret: " + retval);
            var baseAddr = Module.findBaseAddress(moduleName);
            Interceptor.attach(baseAddr.add(nativeFuncAddr), {
                onEnter: function(args) {
                    console.log("[-] hook invoked");
                    console.log(JSON.stringify({
                        a1: args[1].toInt32(),
                        a2: Memory.readUtf8String(Memory.readPointer(args[2])),
                        a3: Boolean(args[3])
                    }, null, '\t'));
                }
            });
        }
    }
});
*/


////////////////////////////////////////////////////////
// where is native
// https://codeshare.frida.re/@dzonerzy/whereisnative/
////////////////////////////////////////////////////////

Java.perform(function() {
    var SystemDef = Java.use('java.lang.System');
    var RuntimeDef = Java.use('java.lang.Runtime');
    var exceptionClass = Java.use('java.lang.Exception');
    var SystemLoad_1 = SystemDef.load.overload('java.lang.String');
    var SystemLoad_2 = SystemDef.loadLibrary.overload('java.lang.String');
    var RuntimeLoad_1 = RuntimeDef.load.overload('java.lang.String');
    var RuntimeLoad_2 = RuntimeDef.loadLibrary.overload('java.lang.String');
    var ThreadDef = Java.use('java.lang.Thread');
    var ThreadObj = ThreadDef.$new();

    SystemLoad_1.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        return SystemLoad_1.call(this, library);
    }

    SystemLoad_2.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        SystemLoad_2.call(this, library);
        return;
    }

    RuntimeLoad_1.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        RuntimeLoad_1.call(this, library);
        return;
    }

    RuntimeLoad_2.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        RuntimeLoad_2.call(this, library);
        return;
    }

    function stackTrace() {
        var stack = ThreadObj.currentThread().getStackTrace();
        for (var i = 0; i < stack.length; i++) {
            send(i + " => " + stack[i].toString());
        }
        send("--------------------------------------------------------------------------");
    }
});



////////////////////////////////////////////////////////
// To find out who the function at 0x1234 calls the next time it is called:
//   start(ptr('0x1234'))
//
// Or to ask the same question about one or more Objective-C methods, whichever is called first:
//   start('-[LicenseManager *]')
//
// Or any exported function named open:
//   start('exports:*!open*')
// https://codeshare.frida.re/@oleavr/who-does-it-call/
////////////////////////////////////////////////////////
/*
var listeners = [];
var activated = false;

function start (target) {
    stop();

    if (typeof target === 'string') {
        var pattern = target;

        var resolver = new ApiResolver((pattern.indexOf(' ') === -1) ? 'module' : 'objc');
        var matches = resolver.enumerateMatchesSync(pattern);
        if (matches.length === 0) {
        throw new Error('No matching methods found');
        }

        matches.forEach(function (match) {
        stalkMethod(match.name, match.address);
        });
    } else {
        stalkMethod(target.toString(), target);
    }
}

function stop () {
    listeners.forEach(function (listener) {
        listener.detach();
    });
    listeners = [];
    activated = false;
}

function stalkMethod (name, impl) {
    console.log('Stalking next call to ' + name);

    var listener = Interceptor.attach(impl, {
        onEnter: function (args) {
        if (activated) {
            return;
        }
        activated = true;

        var targets = {};
        this.targets = targets;

        console.log('\n\nStalker activated: ' + name);
        Stalker.follow({
            events: {
            call: true
            },
            onCallSummary: function (summary) {
            Object.keys(summary).forEach(function (target) {
                var count = summary[target];
                targets[target] = (targets[target] || 0) + count;
            });
            }
        });
        },
        onLeave: function (reval) {
        var targets = this.targets;
        if (targets === undefined) {
            return;
        }

        Stalker.unfollow();
        console.log('Stalker deactivated: ' + name);

        printSummary(targets);
        }
    });
    listeners.push(listener);
}

function printSummary (targets) {
    var items = [];
    var total = 0;
    Object.keys(targets).forEach(function (target) {
        var name = DebugSymbol.fromAddress(ptr(target)).toString();
        var count = targets[target];
        var tokens = name.split(' ', 2).map(function (t) { return t.toLowerCase(); });
        items.push([name, count, tokens]);
        total += count;
    });
    items.sort(function (a, b) {
        var tokensA = a[2];
        var tokensB = b[2];
        if (tokensA.length === tokensB.length) {
        return tokensA[tokensA.length - 1].localeCompare(tokensB[tokensB.length - 1]);
        } else if (tokensA.length > tokensB.length) {
        return -1;
        } else {
        return 1;
        }
    });

    if (items.length > 0) {
        console.log('');
        console.log('COUNT\tNAME');
        console.log('-----\t----');
        items.forEach(function (item) {
        var name = item[0];
        var count = item[1];
        console.log(count + '\t' + name);
        });
    }

    console.log('');
    console.log('Unique functions called: ' + items.length);
    console.log('   Total function calls: ' + total);
    console.log('');
}

start('exports:*!read*');
//start('-[LicenseManager *]')
//start(ptr('0x1234'))
*/