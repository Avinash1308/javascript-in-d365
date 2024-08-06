function deleteChildContacts(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountId = formContext.data.entity.getId().replace(/[{}]/g, '');

    var req = new XMLHttpRequest();
    var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts?$filter=_parentcustomerid_value eq " + encodeURIComponent(accountId);

    req.open("GET", url, true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=*");

    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                console.log(results);

                for (var i = 0; i < results.value.length; i++) {
                    var result = results.value[i];
                    var contactId = result["contactid"]; // Guid

                    // Delete each contact
                    deleteContact(contactId);
                }
            } else {
                console.error(this.responseText);
            }
        }
    };

    req.send();
}

function deleteContact(contactId) {
    var req = new XMLHttpRequest();
    req.open("DELETE", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts(" + encodeURIComponent(contactId) + ")", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 204) {
                console.log("Contact deleted successfully: " + contactId);
            } else {
                console.error("Error deleting contact: " + this.responseText);
            }
        }
    };
    req.send();
}
