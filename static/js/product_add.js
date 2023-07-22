category_selector.onchange = function() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/product/add/"+category_selector.value+'/')
    xhttp.responseType = 'json';
    xhttp.send()
    xhttp.onload = function() {
        // Typical action to be performed when the document is ready:
        document.getElementById("category_characteristics_formset").innerHTML = xhttp.response["data"];
    };
}
