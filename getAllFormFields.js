function mandatoryConfirmGMFAlumniasSpeakers(executionContext)
{

	debugger;
	formContext = executionContext.getFormContext();
	var campaignType = formContext.getAttribute("typecode").getValue();
	
    if(campaignType == "5" || campaignType == "174200000" || campaignType == "174200002" ){
    var allAttributes = formContext.data.entity.attributes.get(); // get all the field present on the form
    for (var i = 0; i < allAttributes.length; i++) {
        var attribute = allAttributes[i]; // Get the attribute object at index i
        var attributeName = attribute._attributeName; // Access the _attributeName property
    
    // Check if the attribute is not "name" or "typecode"
        if (attributeName !== "name" && attributeName !== "typecode") {
            attribute.setRequiredLevel("none"); // Set the required level to "none"
        }
    }
}
    
}
