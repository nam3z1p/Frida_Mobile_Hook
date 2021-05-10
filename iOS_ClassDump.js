console.log("[+] Script loaded successfully ");


if (ObjC.available){
	var matchstring = 'check';
    for (var className in ObjC.classes){
		if (ObjC.classes.hasOwnProperty(className)){
			//send("[*] "+className);
			if(className.toLowerCase().indexOf(matchstring.toLowerCase()) >= 0){
				send("\n\n")
				send("========================================================================");
				send("[*] "+className);
				send("========================================================================");
	
				var methods = ObjC.classes[className].$ownMethods;
				
				for (var i = 0; i < methods.length; i++){
					send(methods[i]);
				}
			}
		}
    }
}
else{
    console.log("Objective-C Runtime is not available!");
}	

