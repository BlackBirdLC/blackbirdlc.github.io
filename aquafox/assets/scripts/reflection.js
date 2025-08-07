function applyImageReflection(selector, options) {
  options = options || {};
  var opacity = typeof options.opacity === 'number' ? options.opacity : 0.5;
  var offset = typeof options.offset === 'number' ? options.offset : 0;
  var heightRatio = typeof options.heightRatio === 'number' ? options.heightRatio : 0.4;

  var images = document.querySelectorAll(selector);

  for (var i = 0; i < images.length; i++) {
    (function (img) {
      if (!img.complete) {
        img.onload = function () {
          applyImageReflection(selector, options);
        };
        return;
      }

      var width = img.width;
      var height = img.height;
      var reflectHeight = Math.floor(height * heightRatio);

      var canvas = document.createElement('canvas');
      if (!canvas.getContext) return; // No canvas support

      var ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = reflectHeight;

      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, -1);
      ctx.drawImage(
        img,
        0, height - reflectHeight,
        width, reflectHeight,
        0, -reflectHeight,
        width, reflectHeight
      );
      ctx.restore();

      var gradient = ctx.createLinearGradient(0, 0, 0, reflectHeight);
      gradient.addColorStop(0, 'rgba(255,255,255,' + (1 - opacity) + ')');
      gradient.addColorStop(1, 'rgba(255,255,255,1)');

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, reflectHeight);

      var wrapper = document.createElement('div');
      wrapper.style.display = 'inline-block';
      wrapper.style.textAlign = 'center';

      canvas.style.display = 'block';
      canvas.style.marginTop = offset + 'px';

      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      wrapper.appendChild(canvas);

    })(images[i]);
  }
}
