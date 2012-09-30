function Count()
{
	this._favicon = false;
	this.settings = new Settings();
	this.faviconLoaded = false;
	this.deferred = false;
	this.setFavicon = function(url)
	{
		var context = this;
		var favicon = new Image();
		favicon.onload = function(e)
		{
			context._favicon = favicon;
			if (context.deferred) context.generate();
		}
		favicon.src = url;
		
		this.faviconLoaded = true;
	}
	
	this._count = 0;
	this.setCount = function(count) { this._count = count; }
	
	this._canvas = false;
	this.setCanvas = function(canvas) { this._canvas = canvas; }
	
	this.draw = function()
	{
		var width = this._canvas.width;
		var height = this._canvas.height;
		this._canvas.height = height;
		this._canvas.width = width;
		
		var context = this._canvas.getContext('2d');
		context.textAlign = "end";
		context.drawImage(this._favicon, 0, 0, this._canvas.width, this._canvas.height);
		
		if (!this._count) return;
		
		var fontFamily = this.settings.get(this.settings.names.fontFamily);		
		var fontSize = this.settings.get(this.settings.names.fontSize);
		var fontColour = this.settings.get(this.settings.names.fontColour);
		
		context.font = fontSize + 'px ' + fontFamily;
		var textMetrics = context.measureText(this._count);
		
		var t = width - textMetrics.width - 2;
		var l = height - fontSize;
		
		context.fillStyle = this.settings.get(this.settings.names.backgroundColour);
		context.fillRect(t, l, 50, 50);
		context.fillStyle = fontColour;
		context.fillText(this._count, 15, 15);
	}
	
	this.generate = function(deferred)
	{
		if (!this._favicon)
		{
			if (deferred) this.deferred = true;
			return;
		}
		
		this.draw();
		
		return this._canvas.toDataURL('image/png');
	}
}