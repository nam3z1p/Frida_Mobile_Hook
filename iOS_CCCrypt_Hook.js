console.log("[+] Script loaded successfully ");


// Usage: After Attaching...
// infoImportsFunction("moduleName", /pattern/i);
// ex) infoImportsFunction("hackcatmlApp", /cccrypt/i);

Process.enumerateModulesSync()
    .filter(function(m){ return m['path'].toLowerCase().indexOf('.app') !=-1 ; })
    .forEach(function(m) {
        console.log(JSON.stringify(m, null, '  '));
        // to list exports use Module.enumerateExportsSync(m.name)
});

function infoImportsFunction(moduleName, importPattern){
    Module.enumerateImportsSync(moduleName)
    .forEach(function(m){
        if(m.name.match(importPattern)){
            console.log(JSON.stringify(m, null, ' '));
        }
    })
}

infoImportsFunction("hackcatmlApp", /cccrypt/i);

/*
// libSystem.B.dylib 모듈로부터 import된 CCCrypt함수 후킹
 Interceptor.attach(Module.findExportByName('libSystem.B.dylib', 'CCCrypt'), {
   onEnter: function (args) {
       // Save the arguments
       this.operation   = args[0]
       this.CCAlgorithm = args[1]
       this.CCOptions   = args[2]
       this.keyBytes    = args[3] 
       this.keyLength   = args[4]
       this.ivBuffer    = args[5]
       this.inBuffer    = args[6] 
       this.inLength    = args[7]
       this.outBuffer   = args[8] 
       this.outLength   = args[9]
       this.outCountPtr = args[10]
       
       console.log('\n\x1b[31mCCCrypt\x1b[0m(' + 
           '\x1b[34moperation: \x1b[32m'   + this.operation    +', ' +
           '\x1b[34mCCAlgorithm: \x1b[32m' + this.CCAlgorithm  +', ' +
           '\x1b[34mCCOptions: \x1b[32m'   + this.CCOptions    +', ' +
           '\x1b[34mkeyBytes: \x1b[32m'    + this.keyBytes     +', ' +
           '\x1b[34mkeyLength: \x1b[32m'   + this.keyLength    +', ' +
           '\x1b[34mivBuffer: \x1b[32m'    + this.ivBuffer     +', ' +
           '\x1b[34minBuffer: \x1b[32m'    + this.inBuffer     +', ' +
           '\x1b[34minLength: \x1b[32m'    + this.inLength     +', ' +
           '\x1b[34moutBuffer: \x1b[32m'   + this.outBuffer    +', ' +
           '\x1b[34moutLength: \x1b[32m'   + this.outLength    +', ' +
           '\x1b[34moutCountPtr: \x1b[32m' + this.outCountPtr  +'\x1b[0m)\n')
           
       if (this.operation == 0) {
           // Show the buffers here if this an encryption operation
           console.log("\x1b[31mIn buffer: \x1b[0m") 
           console.log(hexdump(ptr(this.inBuffer), {
               length: this.inLength.toInt32(),
               header: true,
               ansi: true
           }))
           console.log("\x1b[31mKey(keyBytes): \x1b[0m")
           console.log(hexdump(ptr(this.keyBytes), {
               length: this.keyLength.toInt32(),
               header: true,
               ansi: true
           }))
           console.log("\x1b[31moutCountPtr: \x1b[0m")
           console.log(hexdump(ptr(this.outCountPtr), {
               length: 64,
               header: true,
               ansi: true
           }))
           // console.log("\x1b[31mIV: \x1b[0m")
           // console.log(hexdump(ptr(this.ivBuffer), {
           //     length: this.keyLength.toInt32(),
           //     header: true,
           //     ansi: true
           // }))
       }
   },
   onLeave: function (retVal) {
       if (this.operation == 1) {
           // Show the buffers here if this a decryption operation
           console.log("\x1b[31mOut buffer: \x1b[0m")
           console.log(hexdump(ptr(this.outBuffer), {
               length: Memory.readUInt(this.outCountPtr),
               header: true,
               ansi: true
           }))
           console.log("\x1b[31mKey(keyBytes): \x1b[0m")
           console.log(hexdump(ptr(this.keyBytes), {
               length: this.keyLength.toInt32(),
               header: true,
               ansi: true
           }))
           console.log("\x1b[31moutCountPtr: \x1b[0m")
           console.log(hexdump(ptr(this.outCountPtr), {
               length: 64,
               header: true,
               ansi: true
           }))
          // console.log("\x1b[31mIV: \x1b[0m")
          // console.log(hexdump(ptr(this.ivBuffer), {
          //     length: this.keyLength.toInt32(),
          //     header: true,
          //     ansi: true
          // }))
      }
  }
})
*/

