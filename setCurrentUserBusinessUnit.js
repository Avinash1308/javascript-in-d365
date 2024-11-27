function setCurrentUserBusinessUnit(executionContext) {
    var formContext = executionContext.getFormContext();

    var userId = Xrm.Utility.getGlobalContext().userSettings.userId;

    // Make an asynchronous Web API call to get the current user's business unit
    Xrm.WebApi.online.retrieveRecord("systemuser", userId, "?$select=fullname&$expand=businessunitid($select=name)")
        .then(function (result) {
            // Extract the business unit name
            var businessUnitName = result.businessunitid ? result.businessunitid.name : null;

            // Log the business unit name to the console (for debugging)
            console.log("Business Unit Name: " + businessUnitName);

            // Set the value of the field on the form
            if (businessUnitName) {
                formContext.getAttribute("sun_currentuserbusinessunit").setValue(businessUnitName);
            } else {
                console.error("No business unit found for the current user.");
            }
        })
        .catch(function (error) {
            console.error("Error retrieving user details: " + error.message);
        });
}
