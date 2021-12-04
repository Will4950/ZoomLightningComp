({	  
    doInit : function(cmp, event){        
        var action = cmp.get('c.getContact');       
        var query = "SELECT FirstName,LastName,Email FROM Contact WHERE id= '" + cmp.get("v.recordId") + "'";
        console.log("query: " + query);
		    action.setParams({"soql": query});
        action.setCallback(this, function(res) {
            var resp = res.getReturnValue();
            console.log("response: " + JSON.stringify(res.getReturnValue()));
            cmp.set("v.FirstName", resp[0].FirstName);
            cmp.set("v.LastName", resp[0].LastName);
            cmp.set("v.Email", resp[0].Email);     
        });
 		
        $A.enqueueAction(action);
    },
    
    handleList : function(cmp, event) {
        var JWT = cmp.get("v.JWT");
        var webinarid = cmp.get("v.webinarId");
        var consoleOut = cmp.find("consoleOut");
        consoleOut.set("v.value", "");
        
        var action = cmp.get('c.getWebinarParticipants');
        action.setParams({
            "JWT": JWT, 
            "webinarId": webinarid
        });
        action.setCallback(this, function(res) {
            console.log("response: " + res.getReturnValue());
            var resp = JSON.parse(res.getReturnValue());
            var text = "<p>Webinar: " + webinarid + "</p>";
            text += "<p>Total Registrants: " + resp.total_records + "</p>";
            text += "<p>&nbsp;</p>";
            text += "<table><tr><td>First Name</td><td>Last Name</td><td>Email</td></tr>"
            resp.registrants.forEach((ele) => {
                text += "<tr>";
                text += "<td>" + ele.first_name + "</td>";
                text += "<td>" + ele.last_name + "</td>";
                text += "<td>" + ele.email + "</td>";
                text += "</tr>";
            });
    		text += "</table>"
            consoleOut.set("v.value",text);
        });
        
        $A.enqueueAction(action); 
    },
    
    handleRegister : function(cmp, event) {
        var JWT = cmp.get("v.JWT");
        var webinarid = cmp.get("v.webinarId");
        var FirstName = cmp.get("v.FirstName");
        var LastName = cmp.get("v.LastName");
        var Email = cmp.get("v.Email");
        var consoleOut = cmp.find("consoleOut");
        consoleOut.set("v.value", "");
        
        var jsonout = JSON.stringify({
            "email": Email,
            "first_name": FirstName,
            "last_name": LastName
        });
        
        var action = cmp.get('c.postWebinarParticipant');        
        action.setParams({
            "JWT": JWT,
            "webinarId": webinarid,
            "json": jsonout
        });
        action.setCallback(this, function(res) {
            console.log("response: " + res.getReturnValue());
            var resp = res.getReturnValue();
            consoleOut.set("v.value",resp);
        });
        
        $A.enqueueAction(action);
    },
})
