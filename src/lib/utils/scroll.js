export const scrollTo = function (event, element, repeat){
   const domElement = document.querySelector(element.substr(element.lastIndexOf('#')));
    if(!domElement){
        if(!repeat)
        setTimeout(() => {
            scrollTo(event, element,true);
        }, 200);
        return true;
    }
    if(event) event.preventDefault()
    try {
        domElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } catch (error) {
        //fallback to prevent browser crashing
        domElement.scrollIntoView(false);
    }
    return false;
}