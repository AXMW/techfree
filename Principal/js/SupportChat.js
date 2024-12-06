function openSupport() {
    if(document.getElementById("chat-form-container").style.display == "none"){
        document.getElementById("chat-form-container").style.display = "block";
    } else {
        document.getElementById("chat-form-container").style.display = "none";
    }
    
}

function closeSupport() {
    document.getElementById("chat-form-container").style.display = "none";
}