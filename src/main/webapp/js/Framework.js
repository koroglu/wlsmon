/**
 * 
 */

function loadScript(url)
{
    document.body.appendChild(document.createElement("script")).src = "./js/"+url+".js?rnd="+ Math.random();
}
