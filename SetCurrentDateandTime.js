function setDate(executionContext){
    var formContext = executionContext.getFormContext();
    var Today =new Date()
    formContext.getAttribute("cr97a_date").setValue(Today);
}
