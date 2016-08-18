import L from 'leaflet';

export const icon =(options)=>{
        L.Icon.Syl = L.DivIcon.extend({
        options: {
            className: '',
            iconSize: [],
            color: '',
            opacity: 0.5,
            animate: true,
            heartbeat: 3
        },
        initialize: function (options) {
            L.setOptions(this,options);
            // css
            var uniqueClassName = 'lpi-'+ new Date().getTime()+'-'+Math.round(Math.random()*100000);

            var before = ['background-color: '+this.options.color];
            var after = [

                'box-shadow: 0 0 6px 2px '+this.options.color,

                'animation: pulsate ' + this.options.heartbeat + 's ease-out',
                'animation-iteration-count: infinite',
                'animation-delay: '+ (.1) + 's',
            ];
            if (!this.options.animate){
                after.push('animation: none');
            }
            var css = [
                '.'+uniqueClassName+'{'+before.join(';')+';}',
                '.'+uniqueClassName+':after{'+after.join(';')+';}',
            ].join('');
 
            var el = document.createElement('style');
            if (el.styleSheet){
                el.styleSheet.cssText = css;
            } else {
                el.appendChild(document.createTextNode(css));
            }
            document.getElementsByTagName('head')[0].appendChild(el);
            // apply css class
            this.options.className = this.options.className+' leaflet-pulsing-icon '+uniqueClassName;
            // initialize icon
            L.DivIcon.prototype.initialize.call(this, options);
        }
    });
    return new L.Icon.Syl(options);
}