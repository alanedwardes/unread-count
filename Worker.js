function Worker()
{
	this.settings = new Settings();
	this.uniqueClassId = 'unreadCountExtension' + new Date().getTime();
	this.canvas = false;
	this.setCanvas = function(canvas) { this.canvas = canvas; }
	
	this.work = function()
	{
		var queryInfo = { status: "complete" };
		if (this.settings.get(this.settings.names.pinnedOnly))
		{
			queryInfo.pinned = true;
		}
		var context = this;
		chrome.tabs.query(queryInfo, function(tabs) {
			for (var i = 0; i < tabs.length; i++)
			{
				context.processTab(tabs[i]);
			}
		});
	}
	
	this.allowedURL = function(url)
	{
		var includedSites = this.settings.get(this.settings.names.includedSites);
		var excludedSites = this.settings.get(this.settings.names.excludedSites);
		
		var match = false;
		for (var i = 0; i < includedSites.length; i++)
		{
			var site = includedSites[i];
			if (url.match(site))
			{
				match = true;
				break;
			}
		}
		
		if (match)
		{
			for (var i = 0; i < excludedSites.length; i++)
			{
				var site = excludedSites[i];
				if (tab.url.match(site))
				{
					match = false;
					break;
				}
			}	
		}
		
		return match;
	}
	
	this.extractCountFromTitle = function(title)
	{
		var titleInt = title.match(/\(([0-9]+)\)/g);
		if (!titleInt)
		{
			return 0;
		}
		
		return parseInt(titleInt[0].match(/[0-9]+/g));
	}
	
	this.tabIcons = {};
	this.getAndCreateTabIcon = function(tab)
	{
		if (this.tabIcons[tab.id])
		{
			return this.tabIcons[tab.id];
		}
		else if (!tab.favIconUrl)
		{
			return false;
		}
		else
		{
			var count = new Count();
			count.setCanvas(this.canvas);
			count.setFavicon(tab.favIconUrl);
			this.tabIcons[tab.id] = count;
		}
	}
	
	this.processTab = function(tab)
	{	
		if (!this.allowedURL(tab.url)) return;
		
		var tabIcon = this.getAndCreateTabIcon(tab);
		if (!tabIcon) return;
		if (!tabIcon.faviconLoaded) return;
		
		var count = this.extractCountFromTitle(tab.title);
		tabIcon.setCount(count);
		
		this.setTabIcon(tab, tabIcon.generate());
	}
	
	this.injectFaviconChangeScript = function(icon)
	{
		// This is by far, by far, the worst method I've EVER
		// written. The worst. So the alternative would be to
		// have a content script that loads for *every* tab,
		// and use messages to talk to the content script.
		// But that'd mean the content script would be loaded
		// on every tab, regardless of whether we were listening
		// to it. So this, although disgusting, is cheaper.
		return [
			"var classId = '" + this.uniqueClassId + "';",
			"var linkElement = document.getElementById(classId);",
			"if (!linkElement){",
				"linkElement = document.createElement('link');",
				"linkElement.type = 'image/png';",
				"linkElement.rel = 'shortcut icon';",
				"linkElement.id = classId",
				"if (document.head.children.length > 0) document.head.insertBefore(linkElement, document.head.children[0]);",
				"else document.head.appendChild(linkElement);",
			"}",
			"linkElement.href = '" + icon + "';"	
		].join("\n");
	}
	
	this.setTabIcon = function(tab, icon)
	{
		chrome.tabs.executeScript(tab.id, {
			'code': this.injectFaviconChangeScript(icon)
		});
	}
}