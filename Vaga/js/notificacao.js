function openNotify() {
    if(document.getElementById("notify-form-container").style.display == "block"){
        document.getElementById("notify-form-container").style.display = "none";
    } else {
        document.getElementById("notify-form-container").style.display = "block";
    }
    
}

function closeSupport() {
    document.getElementById("notify-form-container").style.display = "none";
}