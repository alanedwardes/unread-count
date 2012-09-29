function Count()
{
	this._favicon = false;
	this.faviconLoaded = false;
	this.setFavicon = function(url)
	{
		var context = this;
		var favicon = new Image();
		favicon.onload = function(e)
		{
			context._favicon = favicon;
		}
		favicon.src = url;
		
		this.faviconLoaded = true;
	}
	
	this._count = 0;
	this.setCount = function(count) { this._count = count; }
	
	this._canvas = false;
	this.setCanvas = function(canvas) { this._canvas = canvas; }
	
	this.generate = function()
	{
		if (!this._favicon) return;
		
		this._canvas.width = this._canvas.width;
		this._canvas.height = this._canvas.height;
		
		var context = this._canvas.getContext('2d');
		context.drawImage(this._favicon, 0, 0, 16, 16);
		
		if (this._count > 0)
		{
			context.fillText(this._count, 10, 10);
		}
		
		return this._canvas.toDataURL('image/png');
	}
}