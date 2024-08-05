function createChildRecord(executionContext) {
    var formContext = executionContext.getFormContext();
    var guid = formContext.data.entity.getId().replace(/[{}]/g, ''); // Remove curly braces from GUID
    var providerName = formContext.getAttribute("name").getValue();
    var record = {
        lastname: providerName, // Text
        "parentcustomerid_account@odata.bind": "/accounts(" + guid + ")" // Proper binding format
    };
    
    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=*");
    
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 201) { // Changed from 204 to 201
                var uri = req.getResponseHeader("OData-EntityId");
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec(uri);
                var newId = matches ? matches[1] : null;
                console.log(newId);
            } else {
                console.error(this.responseText); // Use console.error for errors
            }
        }
    };
    
    req.send(JSON.stringify(record));
}
