function openSupport() {
    if(document.getElementById("chat-form-container").style.display == "block"){
        document.getElementById("chat-form-container").style.display = "none";
    } else {
        document.getElementById("chat-form-container").style.display = "block";
    }
    
}

function closeSupport() {
    document.getElementById("chat-form-container").style.display = "none";
}