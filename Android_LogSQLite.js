console.log("[+] .js loaded successfully ");

////////////////////////////////////////////////////////
// Log SQLite query
// https://github.com/iddoeldor/frida-snippets#log-sqlite-query
////////////////////////////////////////////////////////

Interceptor.attach(Module.findExportByName('libsqlite.so', 'sqlite3_prepare16_v2'), {
  onEnter: function(args) {
      console.log('DB: ' + Memory.readUtf16String(args[0]) + '\tSQL: ' + Memory.readUtf16String(args[1]));
  }
});