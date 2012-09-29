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
		var context = this._canvas.getContext('2d');
		context.textAlign = "end";
		context.drawImage(this._favicon, 0, 0, this._canvas.width, this._canvas.height);
		
		if (!this._count) return;
		
		var fontFamily = this.settings.get(this.settings.names.fontFamily);		
		var fontSize = this.settings.get(this.settings.names.fontSize);
		var fontColour = this.settings.get(this.settings.names.fontColour);
		
		var textMetrics = context.measureText(this._count);
		
		context.fillStyle = this.settings.get(this.settings.names.backgroundColour);
		context.fillRect(10, 10, textMetrics.width, textMetrics.height);

		context.font = fontSize + 'px ' + fontFamily;
		context.fillStyle = fontColour;
		context.fillText(this._count, 10, 10);
	}
	
	this.generate = function(deferred)
	{
		if (!this._favicon)
		{
			if (deferred) this.deferred = true;
			return;
		}
		
		this._canvas.width = this._canvas.width;
		this._canvas.height = this._canvas.height;
		
		this.draw();
		
		return this._canvas.toDataURL('image/png');
	}
}