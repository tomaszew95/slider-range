var sliderPlugin = document.getElementById("ceros-slider-range-plugin");
var createSlider = (obj, sliderInfo) => {
    //creating div elements
    let divs = [];
    let classesNames = ['slider-container', 'controller-container', 'controller', 'arrows-container'];
    for(let i = 0; i<classesNames.length; i++){
        if(i==2 && sliderInfo.hideCta=='true'){
            console.log("error_00");
            break;
        }
        divs[i] = document.createElement("div");
        divs[i].classList.add(classesNames[i]);
        if(i==0){
            divs[i].id = "slider" + (sliderInfo.num).toString();
        }
        console.log(sliderInfo.hideCta);
    }
    //creating arrows
    if(sliderInfo.hideCta=='false'){
        console.log("error_01");
        let arrows = [];
        for(let x = 0; x<2;x++){
            arrows[x] = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            arrows[x].classList.add("arrows");
            arrows[x].setAttribute("viewBox", "0 0 100 100");
            document.body.append(arrows[x]);
            let arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            arrowPath.classList.add("arrow");
            arrowPath.setAttribute("d", sliderPlugin.getAttribute("arrows"));
            arrows[x].append(arrowPath);
            if(x==0){
                arrows[x].classList.add("left-arrow");
                continue;
            }
            if(x==1){
                arrows[x].classList.add("right-arrow");
                break;
            }
        }
    }
    //creating input element
    var sliderRange = document.createElement('input');
    var inputAttrbutes = ['type', 'min', 'max', 'value', 'step', 'class', 'style'];
    var attributesProperty = ["range", "0", "100", "50", "any", "slider-range","width: 100%; height: 100%;"];
    for(let y = 0; y< inputAttrbutes.length; y++){
        sliderRange.setAttribute(inputAttrbutes[y], attributesProperty[y]);
    }
    //merging elements
    let o = document.getElementById(obj.id);
    o.append(divs[0]);
    divs[0].append(divs[1], sliderRange);
    if(sliderInfo.hideCta == 'false'){
        console.log("error_02");
        divs[1].append(divs[2]);
        divs[2].append(divs[3]);
        divs[3].append(arrows[0], arrows[1]);
    }
    return divs[0];
}

var controlSlider = (e, sliderInfo) =>{
    var beforeComponents = e.findLayersByTag('before' + sliderInfo.num).layers;
    var afterComponents = e.findLayersByTag('after' + sliderInfo.num).layers;
    var getChildren = (components) =>{
        let allChildren = [];
        for(let i = 0; i<components.length; i++){
            let component = document.getElementById(components[i].id);
            //jesli ma child'a, jesli nie uzyj parenta
            //najlepiej jesli pobieraloby to wszyskie children (video)
            let comp = $(component).children().first()[0];
            allChildren[i] = comp;
        }
        return allChildren;
    }
    var beforeComps = getChildren(beforeComponents);
    var afterComps = getChildren(afterComponents);
    var hor = 50 + "%";
    var ver = 0 + "%";
    if(sliderInfo.vertical){
        hor = 0 + "%";
        ver = 50 + "%";
    }

    var sliderContainer = document.getElementById('slider' + sliderInfo.num);
    var sliderContainerParent = $(sliderContainer).parent();
    var slider = sliderContainer.querySelector('input');
    var controllerContainer = sliderContainer.querySelector('.controller-container');
    var controller = $(controllerContainer).children().first();
    // var controlLeft = controllerContainer.style.left;
    var val = slider.getAttribute("value");
    var margins = 0;

    let clipPathFunction = (arr, v) =>{
        let inset = ('inset(' + v.toString() + ')');
        for(let ar of arr){
            ar.style.animation = null;
            ar.style.setProperty('-webkit-clip-path', inset.toString());
            ar.style.setProperty('clip-path', inset.toString());
        }
    }

    if(!sliderInfo.follow){
        slider.addEventListener("input", sliderMove);
    }
    else{
        sliderContainer.addEventListener("mousemove", sliderMove);
        //usunac "mouseout"?
        sliderContainer.addEventListener("mouseout", sliderMove);
    }

    function sliderMove($this){
        if(controllerContainer.style.animation){
            controllerContainer.style.animation = null;
        }
        if(sliderInfo.follow == 'false'){
            val = slider.value;
        }
        else if(($this.offsetX >= 0) || ($this.offsetX <= $($this.target).width())){
            val = ($this.offsetX * 100)/$($this.target).width();
        }

        if(val >= margins && val <= (100 - margins)){
            controllerContainer.style.left = hor + '%';

            clipPathFunction(beforeComps, ('0% ' + (100-hor) + '% ' + (100-ver) + '0%'));
            clipPathFunction(afterComps, (Math.abs(ver-100) + ' 0% 0% ' + hor + '%'));
        }
        else if(val < margins){
            controllerContainer.style.left = (margins + '%');

            clipPathFunction(beforeComps, ('0% ' + (100-margins) + '% 0% 0%'));
            clipPathFunction(afterComps, ('0% 0% 0% ' + margins + '%'));
            if(sliderInfo.vertical){
                clipPathFunction(beforeComps, ('0% 0% ' + (100-margins) + '% 0%'));
                clipPathFunction(afterComps, (margins + '% 0% 0% 0%'));
            }
        }
        else{
            controllerContainer.style.left = ((100 - margins) + '%');

            clipPathFunction(beforeComps, ('0% ' + margins + '% 0% 0%'));
            clipPathFunction(afterComps, ('0% 0% 0% ' + (100-margins) + '%'));
            if(sliderInfo.vertical){
                clipPathFunction(beforeComps, ('0% 0% ' + margins + '% 0%'));
                clipPathFunction(afterComps, ((100-margins) + '% 0% 0% 0%'));
            }
        }
    };

    var localInitialFunction = () => {
        /* basics */
        controllerContainer.style.left = val + '%';
        clipPathFunction(beforeComps, ('0% ' + hor + ' ' + ver + ' 0%'));
        clipPathFunction(afterComps, (ver + ' 0% 0% ' + hor));
        hor = val;
        ver = 100;
        /* optional */
        if(sliderInfo.playAnim){
            controllerContainer.style.animation = 'sliderMove ' + sliderInfo.animType;
            let styleFunction = (arr, animName) =>{
                for(let ar of arr){
                    ar.style.setProperty('animation', animName + sliderInfo.animType);
                }
            }
            styleFunction(beforeComps, 'compAnimBefore ');
            styleFunction(afterComps, 'compAnimAfter ');
        }
        if(sliderInfo.vertical){
            hor = 100;
            ver = val;
        }
        if((sliderInfo.setMargin=='true') && (sliderInfo.hideCta == 'false')){
            //odjac szerokosc linii??
            // margins = ((controller.width()/2)*100)/sliderContainerParent.width();
            margins = ((controller.width()/2)*100)/($(sliderContainer).width());
            console.log(margins);

        }
    }
    localInitialFunction();
}

(function(){
    'use strict';
    require.config({
        paths: {
            CerosSDK: '//sdk.ceros.com/standalone-player-sdk-v5.min'
        }
    });
    require(['CerosSDK'], function (CerosSDK) {
        CerosSDK.findExperience()
            .fail(function (error) {
                console.error(error);
            })
            .done(function (experience) {
                window.myExperience = experience;
                var sliderObjects = experience.findLayersByTag("slider-range").layers;

                experience.on(CerosSDK.EVENTS.PAGE_CHANGED, pageChangedCallback);
                function pageChangedCallback(){
                    var pageContainer = document.querySelector(".page-viewport.top > .page-container");
                    //making new array of sliderObjects that are on current page 
                    var currentPageSliderObjects = sliderObjects.filter(($object) =>{
                        let $obj = document.getElementById($object.id);
                        if(pageContainer.contains($obj)){
                            if($obj.querySelector('.slider-container')){
                                return;
                            }
                            return $object;
                        }
                    });
                    setSliders(currentPageSliderObjects, experience);
                }
            })
    });
})();

var setSliders = (sliders, exp) => {
    var info = [];
    class sliderInformations{
        constructor(num, playAnim, animType, follow, vertical, hideCta, ctaSize, setMargin, lineWidth){
            this.num = num;
            this.playAnim = playAnim;
            this.animType = animType;
            this.follow = follow;
            this.vertical = vertical;
            this.hideCta = hideCta;
            this.ctaSize = ctaSize;
            this.setMargin = setMargin;
            this.lineWidth = lineWidth;
        }
    }
    for(let i = 0;i<sliders.length;i++){
        var tags = sliders[i].getTags();
        var number = i +1;
        var playAnimation = sliderPlugin.getAttribute("play-animation");
        var animationType = sliderPlugin.getAttribute("animation-type");
        var followCursor = sliderPlugin.getAttribute("follow-cursor");
        var verticalOrientation = sliderPlugin.getAttribute("vertical-orientation");
        var hideButton = sliderPlugin.getAttribute("hide-button");
        var buttonSize = parseFloat(sliderPlugin.getAttribute("button-size"));
        var setMargins = sliderPlugin.getAttribute("set-margins");
        var lineThickness = parseFloat(sliderPlugin.getAttribute("line-thickness"));

        _.forEach(tags, function(value, key){
            if(value.indexOf("slider:") > -1){
                let sliderNumber = value.slice(7, value.length);
                number = parseInt(sliderNumber);
            }
            if(value.indexOf("play-animation") > -1){
                playAnimation = true;
            }
            if(value.indexOf("anim:") > -1){
                let a = value.slice(5, value.length).toString();
                animationType = a.replaceAll("-", " ");
            }
            if(value.indexOf("follow") > -1){
                followCursor = true;
            }
            if(value.indexOf("vertical") > -1){
                verticalOrientation = true;
            }
            if(value.indexOf("hide-button") > -1){
                hideButton = true;
            }
            if(value.indexOf("button-size:") > -1){
                let cta = value.slice(12, value.length).toString();
                buttonSize = parseFloat(cta);
            }
            if(value.indexOf("set-margins") > -1){
                setMargins = true;
            }
            if(value.indexOf("line-width:") > -1){
                let line = value.slice(11, value.length).toString();
                buttonSize = parseFloat(line);
            }
        });
        info[i] = new sliderInformations(number, playAnimation, animationType, followCursor, verticalOrientation, hideButton, buttonSize, setMargins, lineThickness);
        createSlider(sliders[i], info[i]);
        controlSlider(exp, info[i]);
    }
}
