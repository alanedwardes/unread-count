function Settings()
{
	// Singleton: http://code.google.com/p/jslibs/wiki/JavascriptTips#Singleton_pattern
	if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
	else arguments.callee._singletonInstance = this;
	
	this.localStorageName = "UnreadCountSettings";

	this.names =
	{
		pinnedOnly: 0,
		includedSites: 1,
		excludedSites: 2,
		fontFamily: 3,
		fontSize: 4,
		fontColour: 5,
		backgroundColour: 6,
	}
	
	this.defaultSettings = {};
	this.defaultSettings[this.names.pinnedOnly] = true;
	this.defaultSettings[this.names.includedSites] = ['twitter.com', 'facebook.com', 'google.com'],
	this.defaultSettings[this.names.excludedSites] = ['imdb.com'];
	this.defaultSettings[this.names.fontFamily] = 'Arial';
	this.defaultSettings[this.names.fontSize] = 10;
	this.defaultSettings[this.names.fontColour] = '#ffffff';
	this.defaultSettings[this.names.backgroundColour] = '#cc0000';
	
	this.get = function(setting)
	{
		return this._settings[setting];
	}
	
	this.set = function(setting, value)
	{
		this._settings[setting] = value;
		this.commit();
	}
	
	this._settings = {};
	this.load = function()
	{
		var settingsText = localStorage[this.localStorageName];
		if (settingsText)
		{
			this._settings = JSON.parse(settingsText);
		}
		else
		{
			this._settings = this.defaultSettings;
		}
	}
	
	this.commit = function()
	{
		localStorage[this.localStorageName] = JSON.stringify(this._settings);
	}
	
	this.reset = function()
	{
		localStorage[this.localStorageName] = '';
	}
	
	this.load();
}