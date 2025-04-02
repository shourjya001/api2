function populateSearchOptions(stype, resultData) {
    document.getElementById("codria_code").value = '';  // Reset input

    // Create select elements
    var selectCode = document.createElement("SELECT");
    selectCode.id = "select_" + stype + "_code";
    selectCode.onchange = new Function("selectdropdown('" + stype + "', 'code')");

    var selectName = document.createElement("SELECT");
    selectName.id = "select_" + stype + "_name";
    selectName.onchange = new Function("selectdropdown('" + stype + "', 'name')");

    // Replace existing elements
    var txtCode = document.getElementById("txt_" + stype + "_code");
    var txtName = document.getElementById("txt_" + stype + "_name");
    
    if (txtCode && txtName) {
        txtCode.parentElement.replaceChild(selectCode, txtCode);
        txtName.parentElement.replaceChild(selectName, txtName);
    }

    // Ensure elements are visible
    var sgrReset = document.all;
    for (var i = 0; i < sgrReset.length; i++) {
        if (sgrReset[i].className == "sgr_reset") {
            sgrReset[i].style.display = 'block';
        }
    }

    // Populate options
    for (var index = 0; index < resultData.length; index++) {
        var item = resultData[index];

        var optionCode = document.createElement("OPTION");
        var optionName = document.createElement("OPTION");

        optionCode.value = item.id;
        optionCode.text = item.id;
        optionName.value = item.id;
        optionName.text = item.name;  // Make sure it reflects proper name

        selectCode.appendChild(optionCode);
        selectName.appendChild(optionName);
    }

    // Always append SGR-related values
    var appendToElement = document.getElementById("subgroupname_id");
    var appendToElement2 = document.getElementById("subgroupname_code");

    if (appendToElement) {
        appendToElement.innerHTML = '';  // Clear old values
        var fragment = document.createDocumentFragment();
        fragment.appendChild(selectName);
        appendToElement.appendChild(fragment);
    }

    if (appendToElement2) {
        appendToElement2.innerHTML = '';  // Clear old values
        var fragment2 = document.createDocumentFragment();
        fragment2.appendChild(selectCode);
        appendToElement2.appendChild(fragment2);
    }
}