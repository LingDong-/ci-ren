// add an event listener to the copy text button with this ass the function
// http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyArea(class, event){
    var copyTextarea = document.querySelector(class);
    copyTextarea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

}