var now = new Date();
var year = now.getFullYear();   

document.addEventListener("DOMContentLoaded", function() {
    setFooter();
});

function setFooter() {
    document.getElementById("footer").innerHTML = `<div id="socialmedia">
    <a href="https://www.linkedin.com/in/thilo-hohl-dev/" class="fa fa-linkedin" target="_blank"></a>
    <a href="https://www.instagram.com/thilolein" class="fa fa-instagram" target="_blank"></a>
    <a href="https://www.github.com/thiilo" class="fa fa-github" target="_blank"></a>
    </div>
    <div id="footertext">
    <p>Schriftarten sind <a href="https://rsms.me/inter/" target="_blank">Inter</a> und <a href="https://fonts.google.com/specimen/DM+Mono" target="_blank">DM Mono</a>, Icons von <a href="https://fontawesome.com/icons" target="_blank">fontawesome</a> und <a href="https://phosphoricons.com/" target="_blank">Phosphor</a>.</p>

    <p>made with <span id="heart">❤️</span> by <svg
    width="2rem"
    height="2rem"
    class="footerunterschrift"
    viewBox="0 0 200 200"
    version="1.1"
    id="svg1"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"><defs
    id="defs1" /><g
    id="layer1"><path
    d="m 29.032472,192.35547 c 0,0 2.145214,3.21851 5.019392,-2.89267 3.031502,-4.97846 49.31854,-169.304548 49.294224,-176.503111 -0.0082,-2.425687 -0.179854,-2.434814 -0.179854,-2.434814"
    id="path2" /><path
    d="m 10.008078,114.32273 c 0,0 -0.4153229,4.26507 3.508175,3.63966 C 73.89226,108.33841 139.48739,101.46407 189.97895,92.339487"
    id="path3" /><path
    d="m 68.256608,128.29148 c 0,0 -1.450885,2.79142 2.933446,3.14205 4.384331,0.35063 42.593336,-15.02612 56.487276,-36.65278 14.95421,-23.277041 18.08145,-45.112582 9.76263,-49.662303 -10.87493,-5.947709 -58.303918,15.125191 -59.840703,120.739673 -0.335652,23.06747 21.531161,-20.14453 25.269713,-11.93214 1.56864,3.44581 4.15264,19.2291 6.59839,19.37674 37.64228,2.27238 63.59018,-63.27035 59.5451,-103.19952 C 162.55622,6.3733714 58.782917,4.4073844 35.630867,105.17262 19.971013,173.32939 63.539553,184.4628 63.539553,184.4628"
    id="path4" /></g></svg>, ${year}</p>
    </div>
    <div class="frogContainer">
    <img id="bottomfrog" src="../../bottomfrog.png" alt="frog für lea, src: @dric">
    </div>`
}