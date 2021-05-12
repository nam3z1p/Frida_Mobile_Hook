console.log("[+] Script loaded successfully ");


////////////////////////////////////////////////////////
// method Hooking
// github.com/0xdea/frida-scripts/blob/master/ios-snippets/raptor_frida_ios_autoIntercept.js
////////////////////////////////////////////////////////

function printType(desc, arg)
{
    try {
        console.log(desc + ObjC.Object(arg).$class + " " + ObjC.Object(arg).$className);
    }
    catch(err) {
        //nothing
    }
}

function printValue(desc, arg)
{
    try {
        console.log(desc + ObjC.Object(arg));
    }
    catch(err) {
        console.log(desc + arg);
    }
}

if(ObjC.available){
    try
    {
        var target = "-[MainViewController webView:shouldStartLoadWithRequest:navigationType:]";

        var classname = target.match(/^[-+]\[(.*)\s/)[1];
        var methodtype = target.match(/^([-+])/)[1];
        var methodname = target.match(/^[-+]\[.*\s(.*)\]/)[1];
        var argcount = (methodname.match(/:/g) || []).length;

        var hook = ObjC.classes[classname][methodtype + " " + methodname].implementation

        //console.log("[+] Class Name: " + classname);
        //console.log("[+] methodtype: " + methodtype);
        //console.log("[+] methodname: " + methodname);
        //console.log("[+] argCount: " + argCount);

        console.log("[+] target: " + target);
        console.log("[+] Hook : " + hook);

        Interceptor.attach(hook, {
            onEnter: function(args) {

                for (var i = 0; i < argcount; i++){
                    //printType("\n[+] arg " + (i + 1) + " type:\t", args[i + 2]);
                    //printValue("[+] arg " + (i + 1) + " value:\t", args[i + 2]);
                    console.log("[+] arg"+(i+1)+": "+args[i + 2]);
                }


                //printType("\n[+] arg"+(1)+" type:\t", args[2]);
                //printValue("[+] arg"+(1)+" value:\t", args[2]);
                //printType("\n[+] arg"+(2)+" type:\t", args[3]);
                //printValue("[+] arg"+(2)+" value:\t", args[3]);

                console.log("\n[+] backtrace \n"+ Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n"));
            },
            onLeave: function(retval) {

                // change retval
                console.log("[+] return Value: " + retval);
                //newretval = ptr("0x0")
                //retval.replace(newretval)
                //console.log("[+] new retval Value: " + newretval)

                // read retval
                //printType("retval type:\t", retval);
                //printValue("retval value:\t", retval);

                // change retval
                //var newretval = ObjC.classes.NSString.stringWithString_("false");
                //retval.replace(newretval);
                //printValue("[+] new retval value:", newretval);

            }
        });
    }
    catch(err)
    {
        console.log("[-] Exception2: " + err.message);
    }
}
else{
    console.log("Objective-C Runtime is not available!");
}



////////////////////////////////////////////////////////
// Native Hooking
// github.com/0xdea/frida-scripts/blob/master/ios-snippets/raptor_frida_ios_lowlevel2.js
////////////////////////////////////////////////////////

/*
if (ObjC.available) {

    // Low-level intercept and backtrace example
    Interceptor.attach(Module.findExportByName("libSystem.B.dylib", "open"), {

        onEnter: function(args) {

            // debug only the intended calls
            this.flag = 0;
            var filename = Memory.readCString(ptr(args[0]));

            //if (filename.indexOf("Bundle") == -1 && filename.indexOf("Cache") == -1) // exclusion list
            if (filename.indexOf("my.interesting.file") != -1) // inclusion list
                this.flag = 1;

            if (this.flag) {
                 console.log("\nopen called from:\n",
                            Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n"),
                        "\n");
                //console.log(filename); // DEBUG
            }
        }
    });

} else {
     send("error: Objective-C Runtime is not available!");
}

*/



////////////////////////////////////////////////////////
// Native Hooking 2
////////////////////////////////////////////////////////
/*
function Memaddress(membase, idabase, idaaddr){
    var offset = ptr(idaaddr).sub(idabase);
    var result = ptr(membase).add(offset);
    return result;
}

if(ObjC.available){
    try
    {
        //sub_100016928
        const membase = Module.findBaseAddress['test']
        const hook = Memaddress(membase, '0x0', '0x16928');

        console.log("[+] Hook : " + hook);

        Interceptor.attach(hook, {
            onEnter: function(args) {

                console.log("[+] args: " + Memory.readUtf8String(args));

                console.log("\n[+] backtrace \n"+ Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n"));
            },
            onLeave: function(retval) {

                // change retval
                console.log("[+] return Value: " + retval);
                //newretval = ptr("0x0")
                //retval.replace(newretval)
                //console.log("[+] new retval Value: " + newretval)

                // read retval
                //printType("retval type:\t", retval);
                //printValue("retval value:\t", retval);

                // change retval
                //var newretval = ObjC.classes.NSString.stringWithString_("false");
                //retval.replace(newretval);
                //printValue("[+] new retval value:", newretval);
            }
        });
    }
    catch(err)
    {
        console.log("[-] Exception2: " + err.message);
    }
}
else{
    console.log("Objective-C Runtime is not available!");
}
*/
