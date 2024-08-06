function updateContactsOnAccountSave(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountId = formContext.data.entity.getId().replace(/[{}]/g, ''); // Clean up the GUID

    // Step 1: Retrieve all contact records related to the account
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() +
        `/api/data/v9.1/contacts?$filter=_parentcustomerid_value eq ${accountId}`, true);
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
                if (results.value && results.value.length > 0) {
                    // Step 2: Update each contact record
                    updateContacts(results.value);
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

function updateContacts(contacts) {
    for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i];
        var contactId = contact.contactid; // GUID

        // Payload to update firstname to "xyz"
        var updatePayload = {
            "firstname": "xyz"
        };

        // Step 3: Send update request for each contact
        var updateReq = new XMLHttpRequest();
        updateReq.open("PATCH", Xrm.Utility.getGlobalContext().getClientUrl() +
            `/api/data/v9.1/contacts(${contactId})`, true);
        updateReq.setRequestHeader("OData-MaxVersion", "4.0");
        updateReq.setRequestHeader("OData-Version", "4.0");
        updateReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        updateReq.setRequestHeader("Accept", "application/json");
        updateReq.setRequestHeader("If-Match", "*"); // To handle concurrency

        updateReq.onreadystatechange = function () {
            if (this.readyState === 4) {
                updateReq.onreadystatechange = null;
                if (this.status === 204) {
                    console.log(`Contact ${contactId} updated successfully.`);
                } else {
                    console.error("Error updating contact:", this.responseText);
                }
            }
        };
        updateReq.send(JSON.stringify(updatePayload));
    }
}
