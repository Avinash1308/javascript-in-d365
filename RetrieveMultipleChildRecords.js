function retrieveContactsByAccount(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountId = formContext.data.entity.getId().replace(/[{}]/g, ''); // Clean up the GUID

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() +
        `/api/data/v9.1/contacts?$select=contactid,firstname,fullname,lastname&$filter=_parentcustomerid_value eq ${accountId}`, true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=*");

    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.responseText);
                console.log(results);
                if (results.value && results.value.length > 0) {
                    for (var i = 0; i < results.value.length; i++) {
                        var result = results.value[i];
                        // Columns
                        var contactid = result["contactid"]; // GUID
                        var firstname = result["firstname"]; // Text
                        var fullname = result["fullname"]; // Text
                        var lastname = result["lastname"]; // Text
                        var message = `Contact ID: ${contactid}\nFirstname: ${firstname}\nLastname: ${lastname}\nFullname: ${fullname}`;
                        alert(message); 
                        
                    }
                } else {
                    console.log("No contacts found for this account.");
                }
            } else {
                console.error("Error retrieving contacts:", this.responseText);
            }
        }
    };
    req.send();
}
